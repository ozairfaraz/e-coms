import React, { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import {
  ShoppingBag,
  Plus,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const VendorDashboard = () => {
  const { handleGetAllVendorProducts } = useProduct();
  const vendorProducts = useSelector((state) => state.product.vendorProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    handleGetAllVendorProducts();
  }, []);

  const handleNextImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % selectedProduct.images.length,
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + selectedProduct.images.length) %
          selectedProduct.images.length,
      );
    }
  };

  const handleSelectImage = (index) => {
    setCurrentImageIndex(index);
  };
  return (
    <div className="min-h-screen bg-[#030304]">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundSize: "50px 50px",
            backgroundImage: `
              linear-gradient(to right, rgba(30, 41, 59, 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(30, 41, 59, 0.5) 1px, transparent 1px)
            `,
            maskImage:
              "radial-gradient(circle at center, black 40%, transparent 100%)",
          }}
        />
      </div>

      {/* Header Section */}
      <div className="relative z-10 border-b border-white/10 bg-[#0F1115]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#EA580C]/20 border border-[#EA580C]/50 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-[#F7931A]" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Your
                  <span className="ml-2 bg-linear-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent">
                    Products
                  </span>
                </h1>
              </div>
              <p className="text-[#94A3B8] text-sm md:text-base">
                Manage and showcase your products
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#EA580C] to-[#F7931A] text-white font-semibold rounded-full hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)] transition-all duration-300 shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]">
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {vendorProducts && vendorProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {vendorProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => {
                  setSelectedProduct(product);
                  setCurrentImageIndex(0);
                }}
                className="group bg-[#0F1115] border border-white/10 rounded-2xl overflow-hidden hover:border-[#F7931A]/50 hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative h-56 md:h-64 bg-black/50 overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#EA580C]/10 to-[#F7931A]/10">
                      <Package className="w-16 h-16 text-[#94A3B8]/50" />
                    </div>
                  )}
                  {/* Overlay Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#EA580C]/20 border border-[#EA580C]/50 rounded-full">
                    <span className="text-xs font-mono text-[#FFD600] font-semibold">
                      Stock
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-[#F7931A] transition-colors duration-200">
                    {product.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#94A3B8] text-sm line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold bg-linear-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent font-mono">
                      ${product.price?.amount || 0}
                    </span>
                    <span className="text-[#94A3B8] text-sm font-mono">
                      {product.price?.currency || "USD"}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="pt-4 border-t border-white/10 flex justify-between text-xs font-mono text-[#94A3B8]">
                    <span>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[#FFD600]">
                      {product.images?.length || 0} imgs
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <button className="flex-1 px-4 py-2 bg-[#EA580C]/20 border border-[#EA580C]/50 text-[#F7931A] font-semibold rounded-lg hover:bg-[#EA580C]/30 hover:shadow-[0_0_15px_rgba(234,88,12,0.3)] transition-all duration-200 text-sm">
                      Edit
                    </button>
                    <button className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 text-sm">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 p-4 bg-[#EA580C]/10 border border-[#EA580C]/30 rounded-2xl">
              <Package className="w-16 h-16 text-[#F7931A]/50 mx-auto" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              No Products Yet
            </h2>
            <p className="text-[#94A3B8] mb-8 max-w-md">
              Start building your shop by adding your first product to showcase
              to customers.
            </p>
            <button className="px-8 py-3 bg-linear-to-r from-[#EA580C] to-[#F7931A] text-white font-semibold rounded-full hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)] transition-all duration-300 shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]">
              Create First Product
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-[#0F1115] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_-10px_rgba(247,147,26,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-6 border-b border-white/10 bg-[#0F1115]/95 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white">
                {selectedProduct.title}
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative bg-black/50 rounded-xl overflow-hidden h-96">
                  {selectedProduct.images &&
                  selectedProduct.images[currentImageIndex] ? (
                    <img
                      src={selectedProduct.images[currentImageIndex].url}
                      alt={`${selectedProduct.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#EA580C]/10 to-[#F7931A]/10">
                      <Package className="w-20 h-20 text-[#94A3B8]/50" />
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {selectedProduct.images &&
                    selectedProduct.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-[#EA580C]/50 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-[#EA580C]/50 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 border border-[#F7931A]/50 rounded-full backdrop-blur-sm">
                    <span className="text-sm font-mono text-[#F7931A]">
                      {currentImageIndex + 1} /{" "}
                      {selectedProduct.images?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {selectedProduct.images &&
                  selectedProduct.images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {selectedProduct.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectImage(index)}
                          className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            currentImageIndex === index
                              ? "border-[#F7931A] shadow-[0_0_15px_rgba(247,147,26,0.5)]"
                              : "border-white/10 hover:border-[#F7931A]/50"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                {/* Price */}
                <div className="space-y-2">
                  <p className="text-[#94A3B8] text-sm uppercase tracking-widest">
                    Price
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-linear-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent font-mono">
                      ${selectedProduct.price?.amount || 0}
                    </span>
                    <span className="text-xl text-[#94A3B8] font-mono">
                      {selectedProduct.price?.currency || "USD"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <p className="text-[#94A3B8] text-sm uppercase tracking-widest">
                    Description
                  </p>
                  <p className="text-white text-base leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Meta Information */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <div className="space-y-2">
                    <p className="text-[#94A3B8] text-xs uppercase tracking-widest">
                      Created
                    </p>
                    <p className="text-white font-mono text-sm">
                      {new Date(selectedProduct.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#94A3B8] text-xs uppercase tracking-widest">
                      Total Images
                    </p>
                    <p className="text-[#FFD600] font-mono text-sm font-semibold">
                      {selectedProduct.images?.length || 0} images
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#94A3B8] text-xs uppercase tracking-widest">
                      Updated
                    </p>
                    <p className="text-white font-mono text-sm">
                      {new Date(selectedProduct.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#94A3B8] text-xs uppercase tracking-widest">
                      Product ID
                    </p>
                    <p className="text-[#94A3B8] font-mono text-xs truncate">
                      {selectedProduct._id}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  <button className="flex-1 px-6 py-3 bg-linear-to-r from-[#EA580C] to-[#F7931A] text-white font-semibold rounded-full hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)] transition-all duration-300 shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]">
                    Edit Product
                  </button>
                  <button className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-200">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
