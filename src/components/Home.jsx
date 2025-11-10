import React, { useEffect, useState } from "react";

const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-500 text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-2">Shop Now</h2>
        <p className="text-lg mb-6">All Products, All Categories</p>
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-full px-4 py-2 text-black"
          />
        </div>
      </section>

      {/* Category Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-8">
        {categories.map(category => (
          <div
            key={category.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg p-6 flex flex-col items-center transition"
          >
            <span className="text-5xl mb-3">{category.icon}</span>
            <h3 className="text-gray-800 font-semibold text-lg">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
