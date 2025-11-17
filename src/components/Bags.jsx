import React, { useEffect, useState, useMemo } from "react";

const Bags = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetch("/data_clean.json")
      .then(res => res.json())
      .then(data => {
        setProducts(data.bags);
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
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [products, searchQuery, sortBy, priceRange, ratingFilter]);

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleToggleWishlist = (productId) => {
    const updatedWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  if (loading) return <div className="text-center py-20 mt-20">Loading products...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Bags</h1>

        {/* Header Stats */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="text-lg font-semibold">Total Products: {filteredProducts.length}</div>
          <div className="text-lg font-semibold">Cart Items: {cartCount}</div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search bags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Sort */}
          <div>
            <label className="block font-semibold mb-2">Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select select-bordered w-full">
              <option value="name">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block font-semibold mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="150"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="range range-sm w-full"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block font-semibold mb-2">Min Rating: {ratingFilter.toFixed(1)} ⭐</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
              className="range range-sm w-full"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-all">
                <div className="text-5xl mb-4 text-center">{product.image}</div>
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">
                  {product.capacity || product.material || product.fits || "Premium Bag"}
                </p>
                <p className="font-semibold text-xl text-blue-600 mb-2">${product.price}</p>
                <p className="text-sm text-yellow-600 mb-4">⭐ {product.rating}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 btn btn-sm btn-primary"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleToggleWishlist(product.id)}
                    className={`btn btn-sm ${wishlist.includes(product.id) ? 'btn-error' : 'btn-outline'}`}
                  >
                    {wishlist.includes(product.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No bags found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bags;
