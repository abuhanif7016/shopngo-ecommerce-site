import React, { useEffect, useState, useMemo } from "react";

const Apparel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [selectedSize, setSelectedSize] = useState({});

  useEffect(() => {
    fetch("/data_clean.json")
      .then(res => res.json())
      .then(data => {
        setProducts(data.apparel);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading products:", error);
        setLoading(false);
      });

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      setCartCount(parsedCart.length);
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Filter and sort products dynamically
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesRating = product.rating >= ratingFilter;
        return matchesSearch && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          case "name":
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [products, searchQuery, sortBy, priceRange, ratingFilter]);

  const handleAddToCart = (product) => {
    const size = selectedSize[product.id] || product.sizes[0];
    const existingItem = cart.find(item => item.id === product.id && item.size === size);

    let updatedCart;
    if (existingItem) {
      existingItem.quantity += 1;
      updatedCart = [...cart];
    } else {
      updatedCart = [...cart, { ...product, quantity: 1, size }];
    }

    setCart(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.name} (Size: ${size}) added to cart!`);
  };

  const handleAddToWishlist = (product) => {
    const isInWishlist = wishlist.find(item => item.id === product.id);
    let updatedWishlist;
    
    if (isInWishlist) {
      updatedWishlist = wishlist.filter(item => item.id !== product.id);
      alert(`${product.name} removed from wishlist!`);
    } else {
      updatedWishlist = [...wishlist, product];
      alert(`${product.name} added to wishlist!`);
    }
    
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-linear-to-r from-cyan-950 to-cyan-900 text-white py-12 pt-16 pb-3 text-center sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">Apparel</h1>
          <p className="text-sm">Discover stylish and comfortable clothing</p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="inline-block bg-white text-purple-600 px-4 py-2 rounded-full font-semibold">
              🛒 Cart: {cartCount} items
            </div>
            <div className="inline-block bg-white text-red-600 px-4 py-2 rounded-full font-semibold">
              ❤️ Wishlist: {wishlist.length} items
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white p-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Filters & Search</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border text-black  border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="name" className="text-black">Name (A-Z)</option>
                <option value="price-low" className="text-black">Price: Low to High</option>
                <option value="price-high" className="text-black">Price: High to Low</option>
                <option value="rating" className="text-black">Rating: High to Low</option>
              </select>
            </div>

             

            {/* Price Range */}
            <div>

              {/* Reset Button */}
          <button
            onClick={() => {
              setSearchQuery("");
              setSortBy("name");
              setPriceRange([0, 100]);
              setRatingFilter(0);
            }}
            className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Reset Filters
          </button>
              {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Price: ${priceRange[1]}
              </label> */}
              {/* <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full"
              /> */}
              {/* <div className="text-xs text-gray-00 mt-1">$0 - ${priceRange[1]}</div> */}
            </div>

            {/* Rating Filter */}
            <div>
              {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Rating: ⭐ {ratingFilter.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                className="w-full"
              /> */}
              {/* <div className="text-xs text-gray-500 mt-1">0 - 5 stars</div> */}
            </div>
          </div>

         
        </div>
      </section>

      {/* Results Count */}
      <section className="bg-white p-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 font-semibold">
            Showing <span className="text-purple-600">{filteredProducts.length}</span> of{" "}
            <span className="text-purple-600">{products.length}</span> products
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="p-8 max-w-7xl mx-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105 overflow-hidden"
              >
                <div className="text-6xl text-center py-12 bg-linear-to-br from-purple-100 to-purple-50">
                  {product.image}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                  
                  {/* Size Selection */}
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Size:
                    </label>
                    <select
                      value={selectedSize[product.id] || product.sizes[0]}
                      onChange={(e) => setSelectedSize({ ...selectedSize, [product.id]: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {product.sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-purple-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-yellow-500 font-semibold">
                      ⭐ {product.rating}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        wishlist.find(item => item.id === product.id)
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {wishlist.find(item => item.id === product.id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl font-semibold">No products found matching your filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSortBy("name");
                setPriceRange([0, 100]);
                setRatingFilter(0);
              }}
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Back Button */}
      <div className="text-center pb-8">
        <button
          onClick={() => window.location.href = "/"}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Apparel;
