import { useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import "./ProductForm.css";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "INR"];
const MAX_IMAGES = 7;

export default function ProductForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
    images: [],
  });

  const [preview, setPreview] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.priceAmount || formData.priceAmount <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (preview.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
  };

  const addImages = (files) => {
    const remaining = MAX_IMAGES - preview.length;
    const filesToAdd = files.slice(0, remaining);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview((prev) => [...prev, reader.result]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, file],
        }));
      };
      reader.readAsDataURL(file);
    });

    if (files.length > remaining) {
      setErrors((prev) => ({
        ...prev,
        images: `Only ${remaining} more image(s) can be added (max ${MAX_IMAGES})`,
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setErrors((prev) => ({
        ...prev,
        images: "Please drop valid image files",
      }));
      return;
    }

    addImages(imageFiles);
  };

  const removeImage = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create FormData for multipart upload
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("priceAmount", parseFloat(formData.priceAmount).toString());
    form.append("priceCurrency", formData.priceCurrency);

    // Append all image files
    formData.images.forEach((image) => {
      form.append("images", image);
    });

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <div>
          <label className="block font-heading font-semibold text-white mb-2">
            Product Images
            <span className="text-[#F7931A] ml-1">*</span>
          </label>
          <p className="text-[#94A3B8] text-sm mb-4">
            Upload up to {MAX_IMAGES} high-quality images. Drag and drop or
            click to select.
          </p>
        </div>

        {/* Image Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer ${
            dragActive
              ? "border-[#F7931A] bg-[#EA580C]/10"
              : "border-white/20 hover:border-white/40"
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            disabled={preview.length >= MAX_IMAGES}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              {preview.length >= MAX_IMAGES ? (
                <ImageIcon size={48} className="text-[#F7931A] opacity-60" />
              ) : (
                <Upload
                  size={48}
                  className={`${
                    dragActive ? "text-[#F7931A]" : "text-[#94A3B8]"
                  } transition-colors`}
                />
              )}
            </div>
            <p className="font-heading font-semibold text-white mb-1">
              {preview.length >= MAX_IMAGES
                ? "Maximum images reached"
                : "Drag images here or click to browse"}
            </p>
            <p className="text-[#94A3B8] text-sm">
              {preview.length}/{MAX_IMAGES} images uploaded
            </p>
          </div>
        </div>

        {errors.images && (
          <p className="text-[#FF6B6B] text-sm font-mono">{errors.images}</p>
        )}

        {/* Image Preview Grid */}
        {preview.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {preview.map((src, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg border border-white/10 hover:border-[#F7931A]/50 transition-all duration-300"
              >
                <img
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="bg-[#EA580C] hover:bg-[#F7931A] text-white rounded-full p-2 transition-all"
                    title="Remove image"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-mono text-[#FFD600]">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Title Field */}
      <div>
        <label
          htmlFor="title"
          className="block font-heading font-semibold text-white mb-2"
        >
          Product Title
          <span className="text-[#F7931A] ml-1">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter product title"
          maxLength={100}
          className={`w-full bg-black/50 border-b-2 px-4 py-3 text-white placeholder:text-white/30 transition-all focus:outline-none ${
            errors.title
              ? "border-b-[#FF6B6B]"
              : "border-b-white/20 focus:border-b-[#F7931A]"
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.title && (
            <span className="text-[#FF6B6B] text-sm font-mono">
              {errors.title}
            </span>
          )}
          <span className="text-[#94A3B8] text-xs ml-auto">
            {formData.title.length}/100
          </span>
        </div>
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block font-heading font-semibold text-white mb-2"
        >
          Product Description
          <span className="text-[#F7931A] ml-1">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your product in detail..."
          maxLength={1000}
          rows={6}
          className={`w-full bg-black/50 border-2 rounded-lg px-4 py-3 text-white placeholder:text-white/30 resize-none transition-all focus:outline-none ${
            errors.description
              ? "border-[#FF6B6B]"
              : "border-white/10 focus:border-[#F7931A]"
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.description && (
            <span className="text-[#FF6B6B] text-sm font-mono">
              {errors.description}
            </span>
          )}
          <span className="text-[#94A3B8] text-xs ml-auto">
            {formData.description.length}/1000
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Price Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block font-heading font-semibold text-white mb-2"
          >
            Price Amount
            <span className="text-[#F7931A] ml-1">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] font-mono">
              ₹
            </span>
            <input
              type="number"
              id="amount"
              name="priceAmount"
              value={formData.priceAmount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`w-full bg-black/50 border-b-2 pl-8 pr-4 py-3 text-white placeholder:text-white/30 transition-all focus:outline-none ${
                errors.price
                  ? "border-b-[#FF6B6B]"
                  : "border-b-white/20 focus:border-b-[#F7931A]"
              }`}
            />
          </div>
          {errors.price && (
            <span className="text-[#FF6B6B] text-sm font-mono mt-1 block">
              {errors.price}
            </span>
          )}
        </div>

        {/* Currency Select */}
        <div>
          <label
            htmlFor="currency"
            className="block font-heading font-semibold text-white mb-2"
          >
            Currency
            <span className="text-[#F7931A] ml-1">*</span>
          </label>
          <select
            id="currency"
            name="priceCurrency"
            value={formData.priceCurrency}
            onChange={handleChange}
            className="w-full bg-black/50 border-b-2 border-b-white/20 px-4 py-3 text-white transition-all focus:outline-none focus:border-b-[#F7931A] appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23F7931A' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "2rem",
            }}
          >
            {CURRENCIES.map((curr) => (
              <option
                key={curr}
                value={curr}
                className="bg-[#0F1115] text-white"
              >
                {curr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-full font-heading font-semibold uppercase tracking-wider transition-all duration-300 ${
            isLoading
              ? "bg-gradient-to-r from-[#EA580C] to-[#F7931A] opacity-50 cursor-not-allowed"
              : "bg-gradient-to-r from-[#EA580C] to-[#F7931A] hover:scale-105 shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)]"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Product...
            </span>
          ) : (
            "Create Product"
          )}
        </button>
      </div>
    </form>
  );
}
