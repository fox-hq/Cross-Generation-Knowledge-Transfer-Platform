import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { LoadingPage } from "@/components/ui/loading";

export function MarketplaceSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiRequest("GET", "/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        setError("Failed to load products");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900">Craftspeople Marketplace</h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            Discover and purchase authentic handcrafted items directly from master artisans and support the preservation of traditional crafts
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-56">
                <img 
                  src={product.imageUrl}
                  alt={product.title} 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-neutral-900 text-lg mb-1">{product.title}</h3>
                <p className="text-neutral-600 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">{product.sellerId}</span>
                    </div>
                    <span className="text-xs text-neutral-500">By Seller #{product.sellerId}</span>
                  </div>
                  <span className="font-medium text-primary">${Number(product.price)}</span>
                </div>
                <Button asChild className="w-full mt-4" size="sm">
                  <Link href="/checkout">Add to Cart</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link href="/marketplace">Visit Marketplace</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
