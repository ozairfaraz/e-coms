import { useState } from "react";
import ProductForm from "../components/ProductForm";
import { ArrowLeft } from "lucide-react";
import { useProduct } from "../hook/useProduct";
import { useNavigate } from "react-router";

export default function CreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await handleCreateProduct(formData);
      navigate("/");
    } catch (error) {
      console.error(
        "❌ Error creating product:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030304] py-12 px-4 sm:px-6 lg:px-8">
      {/* Grid Background Pattern */}
      <div
        className="fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(30, 41, 59, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 41, 59, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          maskImage:
            "radial-gradient(circle at 50% 0%, black 0%, transparent 100%)",
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F7931A] transition-colors mb-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-mono">Back</span>
          </button>

          <div className="space-y-2">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
              Create New <span className="text-gradient">Product</span>
            </h1>
            <p className="text-[#94A3B8] text-lg">
              List your product on the network. Add compelling images, pricing,
              and details to attract customers.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative">
          {/* Glow Background Effect */}
          <div
            className="absolute inset-0 rounded-3xl opacity-20 blur-3xl -z-10"
            style={{
              background:
                "radial-gradient(circle at 30% 50%, #EA580C, transparent 70%)",
            }}
          />

          <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📸",
              title: "High-Quality Images",
              description: "Upload up to 7 images. Use clear, well-lit photos.",
            },
            {
              icon: "💰",
              title: "Fair Pricing",
              description: "Set competitive prices in multiple currencies.",
            },
            {
              icon: "📝",
              title: "Detailed Description",
              description: "Help customers understand your product better.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0F1115]/50 border border-white/5 rounded-xl p-6 hover:border-[#F7931A]/30 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-heading font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-[#94A3B8] text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
