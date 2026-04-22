import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import {
  ShoppingBag,
  ShoppingCart,
  Zap,
  ChevronLeft,
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  Package,
  Check,
  Tag,
  Clock,
  Award,
} from "lucide-react";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { handleGetProductDetails } = useProduct();
  const product = useSelector((state) => state.product.productDetails);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (productId) handleGetProductDetails(productId);
  }, [productId]);

  useEffect(() => {
    setSelectedImage(0);
  }, [product?._id]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    console.log("Buy Now:", { product, quantity });
  };

  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setSelectedImage((p) => (p === 0 ? product.images.length - 1 : p - 1));
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setSelectedImage((p) => (p === product.images.length - 1 ? 0 : p + 1));
  };

  if (!product || !product._id) {
    return (
      <div className="min-h-screen bg-[#030304] flex items-center justify-center">
        <div className="absolute w-96 h-96 bg-[#F7931A] opacity-5 blur-[150px] rounded-full pointer-events-none" />
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-[#EA580C] to-[#F7931A] rounded-2xl opacity-20 animate-pulse-glow" />
            <div className="w-16 h-16 bg-[#0F1115] border border-white/10 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-[#F7931A]" />
            </div>
          </div>
          <p className="font-heading text-lg text-white font-semibold mb-1">Loading Product</p>
          <p className="font-mono text-xs text-[#94A3B8]">Fetching details...</p>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const price = product.price?.amount || 0;
  const currency = product.price?.currency || "USD";

  return (
    /* Full viewport height layout on desktop */
    <div className="h-screen flex flex-col bg-[#030304] bg-grid-pattern overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed top-1/4 left-1/4 w-[400px] h-[400px] bg-[#F7931A] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#EA580C] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      {/* ── Header ── */}
      <div className="shrink-0 z-50 bg-[#0F1115]/95 border-b border-white/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F7931A] transition-colors duration-200 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-xs hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-[#EA580C] to-[#F7931A] rounded-lg">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-heading font-bold text-white text-sm hidden sm:inline">
              Threads
            </span>
          </div>
        </div>
      </div>

      {/* ── Body: scrollable on mobile, fixed on desktop ── */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col lg:flex-row gap-6 lg:gap-10 lg:h-full">

          {/* ══ LEFT: Gallery ══ */}
          <div className="w-full lg:w-[52%] flex flex-col sm:flex-row gap-2 lg:h-full lg:overflow-hidden">

            {/* Vertical thumbnail strip — desktop only vertical, mobile horizontal */}
            {images.length > 1 && (
              <div
                className="
                  flex gap-2
                  sm:flex-col sm:w-[68px] sm:shrink-0
                  flex-row w-full
                  overflow-x-auto sm:overflow-x-hidden
                  overflow-y-hidden sm:overflow-y-auto
                  order-2 sm:order-1
                  pb-1 sm:pb-0
                  lg:h-full
                "
                style={{ scrollbarWidth: "none" }}
              >
                {images.map((img, idx) => (
                  <button
                    key={img._id}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === idx
                        ? "border-[#F7931A] shadow-[0_0_10px_-2px_rgba(247,147,26,0.5)]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative group flex-1 bg-[#0F1115] border border-white/10 rounded-xl overflow-hidden order-1 sm:order-2 aspect-square sm:aspect-auto lg:h-full hover:border-[#F7931A]/30 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(247,147,26,0.15)]">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]?.url}
                  alt={`${product.title} — image ${selectedImage + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-[#94A3B8]/20" />
                </div>
              )}

              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-md">
                  <span className="font-mono text-[11px] text-[#FFD600] font-semibold">
                    {selectedImage + 1} / {images.length}
                  </span>
                </div>
              )}

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:border-[#F7931A]/50 hover:bg-[#F7931A]/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:border-[#F7931A]/50 hover:bg-[#F7931A]/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ══ RIGHT: Info panel — scrollable inside ══ */}
          <div className="w-full lg:w-[48%] flex flex-col gap-4 lg:overflow-y-auto lg:h-full lg:pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#EA580C #0F1115" }}>

            {/* Tag + Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EA580C]/10 border border-[#EA580C]/30 rounded-full mb-2">
                <Tag className="w-3 h-3 text-[#F7931A]" />
                <span className="font-mono text-[11px] text-[#F7931A] tracking-wider uppercase">
                  Premium Collection
                </span>
              </div>
              <h1 className="font-heading font-bold text-xl md:text-2xl xl:text-3xl text-white leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div className="p-4 bg-[#0F1115] border border-white/10 rounded-xl hover:border-[#F7931A]/20 transition-colors duration-300">
              <p className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-bold text-gradient">
                  ${price.toLocaleString()}
                </span>
                <span className="font-mono text-xs text-[#94A3B8]">{currency}</span>
              </div>
              <p className="font-mono text-[10px] text-[#94A3B8] mt-0.5">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-heading font-semibold text-sm text-white mb-1.5 flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-[#EA580C] to-[#F7931A] rounded-full inline-block" />
                Description
              </h2>
              <p className="font-body text-[#94A3B8] text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider mb-2">
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#0F1115] border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-[#F7931A]/10 hover:text-[#F7931A] transition-all duration-200 font-mono text-base"
                    aria-label="Decrease"
                  >−</button>
                  <span className="w-10 text-center font-mono font-bold text-white text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-[#F7931A]/10 hover:text-[#F7931A] transition-all duration-200 font-mono text-base"
                    aria-label="Increase"
                  >+</button>
                </div>
                <span className="font-mono text-[11px] text-[#94A3B8]">Only 12 left in stock</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 border-2 rounded-full font-body font-semibold text-xs uppercase tracking-wider transition-all duration-300 ${
                  addedToCart
                    ? "border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_16px_-5px_rgba(34,197,94,0.4)]"
                    : "border-[#F7931A]/50 bg-[#F7931A]/5 text-[#F7931A] hover:bg-[#F7931A]/10 hover:border-[#F7931A] hover:shadow-[0_0_16px_-5px_rgba(247,147,26,0.3)]"
                }`}
              >
                {addedToCart ? <><Check className="w-3.5 h-3.5" /> Added!</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>}
              </button>

              <button
                id="buy-now-btn"
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white rounded-full font-body font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_24px_-5px_rgba(247,147,26,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Zap className="w-3.5 h-3.5" /> Buy Now
              </button>
            </div>

            {/* Offers */}
            <div className="p-4 bg-[#0F1115] border border-white/10 rounded-xl space-y-2.5">
              <h3 className="font-heading font-semibold text-xs text-white flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#FFD600]" />
                Available Offers
              </h3>
              {[
                { icon: Tag, text: "10% off on first order — Use code FIRST10" },
                { icon: Truck, text: "Free delivery on orders above $50" },
                { icon: Clock, text: "Order within 2 hrs for same-day dispatch" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2">
                  <div className="mt-0.5 p-1 bg-[#F7931A]/10 rounded-md shrink-0">
                    <Icon className="w-2.5 h-2.5 text-[#F7931A]" />
                  </div>
                  <p className="font-body text-[11px] text-[#94A3B8] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Shield, label: "Secure Pay", sub: "256-bit SSL" },
                { icon: Truck, label: "Free Delivery", sub: "On $50+" },
                { icon: RotateCcw, label: "Easy Returns", sub: "30 days" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 p-2.5 bg-[#0F1115] border border-white/5 rounded-xl text-center hover:border-white/10 transition-colors duration-200"
                >
                  <Icon className="w-3.5 h-3.5 text-[#F7931A]" />
                  <p className="font-body text-[10px] text-white font-medium leading-tight">{label}</p>
                  <p className="font-mono text-[9px] text-[#94A3B8]">{sub}</p>
                </div>
              ))}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Product ID", value: product._id?.slice(-8).toUpperCase() },
                { label: "Currency", value: currency },
                {
                  label: "Listed",
                  value: new Date(product.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  }),
                },
                { label: "Images", value: `${images.length} photos` },
              ].map(({ label, value }) => (
                <div key={label} className="p-2.5 bg-[#0F1115] border border-white/5 rounded-xl">
                  <p className="font-mono text-[9px] text-[#94A3B8] uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="font-mono text-xs text-white font-medium">{value}</p>
                </div>
              ))}
            </div>

            {/* bottom breathing room for mobile */}
            <div className="h-4 shrink-0 lg:hidden" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
