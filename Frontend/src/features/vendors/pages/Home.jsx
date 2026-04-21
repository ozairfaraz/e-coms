import React, { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { Search, ShoppingBag, Package, User } from "lucide-react";

const Home = () => {
  const { handleGetAllProducts } = useProduct();
  const products = useSelector((state) => state.product.products);
  const user = useSelector((state) => state.auth.user);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      let filtered = products;

      if (searchTerm) {
        filtered = filtered.filter(
          (p) =>
            p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  return (
    <div className="min-h-screen bg-[#030304]">
      {/* Sticky Header with Search */}
      <div className="sticky top-0 z-50 bg-[#0F1115]/95 border-b border-white/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-3 md:gap-6 w-full">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="p-2 bg-gradient-to-br from-[#EA580C] to-[#F7931A] rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline font-heading font-bold text-white text-lg">
                Threads
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative group max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-[#EA580C]/20 to-[#F7931A]/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-[#0F1115] border border-white/10 rounded-lg p-2.5 flex items-center gap-2 hover:border-[#F7931A]/50 transition-all duration-300">
                <Search className="w-4 h-4 text-[#F7931A] shrink-0" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none font-body text-sm"
                />
              </div>
            </div>

            {/* User Profile */}
            {user && (
              <button className="ml-auto shrink-0 flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 border border-white/20 rounded-lg hover:bg-[#F7931A]/10 hover:border-[#F7931A]/50 transition-all duration-200 group">
                <div className="w-8 h-8 bg-gradient-to-br from-[#EA580C] to-[#F7931A] rounded-full flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:inline text-white font-mono text-sm font-semibold group-hover:text-[#F7931A] transition-colors">
                  {user.fullName || user.email}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid - Immediate Visibility */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {filteredProducts && filteredProducts.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[#94A3B8] font-mono text-sm">
                Showing {filteredProducts.length} products
              </p>
              <select className="bg-[#0F1115] border border-white/10 text-white text-sm rounded px-3 py-2 font-mono hover:border-[#F7931A]/50 transition-colors">
                <option>Sort by: Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-[#0F1115] border border-white/10 rounded-xl overflow-hidden hover:border-[#F7931A]/50 hover:shadow-[0_0_20px_-5px_rgba(247,147,26,0.3)] transition-all duration-300 cursor-pointer h-full flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative bg-gradient-to-br from-[#EA580C]/5 to-[#F7931A]/5 overflow-hidden aspect-square">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-[#94A3B8]/30" />
                      </div>
                    )}

                    {/* Badge */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-[#EA580C]/20 border border-[#EA580C]/50 rounded-md backdrop-blur-sm">
                        <p className="text-xs font-mono text-[#FFD600] font-semibold">
                          +{product.images.length - 1}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 md:p-4 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="font-heading font-semibold text-sm md:text-base text-white line-clamp-2 mb-2 group-hover:text-[#F7931A] transition-colors">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg md:text-xl font-mono font-bold text-[#F7931A]">
                        ${product.price?.amount || 0}
                      </span>
                      <span className="text-xs text-[#94A3B8] font-mono">
                        {product.price?.currency || "USD"}
                      </span>
                    </div>

                    {/* Add to Cart */}
                    <button className="mt-auto pt-3 w-full px-3 py-2 bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white font-semibold rounded-lg text-xs md:text-sm hover:shadow-[0_0_15px_-3px_rgba(247,147,26,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 uppercase tracking-wide">
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 p-4 bg-[#EA580C]/10 border border-[#EA580C]/30 rounded-2xl">
              <ShoppingBag className="w-16 h-16 text-[#F7931A]/50 mx-auto" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              No Products Found
            </h3>
            <p className="text-[#94A3B8] max-w-md text-sm">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Loading products..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
