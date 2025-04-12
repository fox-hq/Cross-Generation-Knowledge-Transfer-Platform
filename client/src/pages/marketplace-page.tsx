import { useState, useEffect } from "react";
import { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function MarketplacePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("default");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  const categories = ["all", "Woodworking", "Leatherwork", "Blacksmithing", "Culinary", "Textile Arts", "Ceramics", "Basketry"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, coursesRes] = await Promise.all([
          apiRequest("GET", "/api/products"),
          apiRequest("GET", "/api/courses")
        ]);
        const productsData = await productsRes.json();
        const coursesData = await coursesRes.json();
        setProducts(productsData);
        setCourses(coursesData);
      } catch (error) {
        setError("Failed to load marketplace items");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchProducts = async () => {
      try {
        const res = await apiRequest("GET", "/api/products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        setError("Failed to load products");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query and category
    let filtered = products;
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Sort products
    if (priceSort !== "default") {
      filtered = [...filtered].sort((a, b) => {
        const aPrice = Number(a.price);
        const bPrice = Number(b.price);
        return priceSort === "lowToHigh" ? aPrice - bPrice : bPrice - aPrice;
      });
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, priceSort, products]);

  const addToCart = (product: Product) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.title} added to your cart`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, quantity } 
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (Number(item.product.price) * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }
    
    window.location.href = "/checkout";
  };

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900">Craftspeople Marketplace</h1>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            Discover and purchase authentic handcrafted items directly from master artisans and support the preservation of traditional crafts
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-48">
                <Select value={priceSort} onValueChange={setPriceSort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                    <SelectItem value="highToLow">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-600">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
                      <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-2">
                            <span className="text-xs font-bold">{product.sellerId}</span>
                          </div>
                          <span className="text-xs text-neutral-500">By Artisan #{product.sellerId}</span>
                        </div>
                        <span className="font-medium text-primary">${Number(product.price)}</span>
                      </div>
                      <Button className="w-full mt-4" size="sm" onClick={() => addToCart(product)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Available Courses</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative h-56">
                      <img 
                        src={course.imageUrl}
                        alt={course.title} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {course.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-neutral-900 text-lg mb-1">{course.title}</h3>
                      <p className="text-neutral-600 text-sm mb-3">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-primary">${Number(course.price)}</span>
                        <span className="text-sm text-neutral-500">{course.duration}</span>
                      </div>
                      <Button className="w-full mt-4" size="sm" asChild>
                        <Link href={`/course/${course.id}`}>View Course</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-neutral-900">Your Cart</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-neutral-500"
                  onClick={() => setShowCart(!showCart)}
                >
                  {showCart ? 'Hide' : 'Show'}
                </Button>
              </div>
              
              {showCart && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-neutral-600">Your cart is empty</p>
                      <p className="text-sm text-neutral-500 mt-1">Add some unique handcrafted items!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-4">
                      {cart.map((item) => (
                        <Card key={item.product.id} className="overflow-hidden">
                          <div className="flex p-3">
                            <div className="w-16 h-16 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.title}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="ml-3 flex-grow">
                              <h3 className="font-medium text-sm line-clamp-1">{item.product.title}</h3>
                              <p className="text-primary text-sm font-medium">${Number(item.product.price)}</p>
                              
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  >
                                    <span>-</span>
                                  </Button>
                                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  >
                                    <span>+</span>
                                  </Button>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeFromCart(item.product.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <CardFooter className="flex flex-col px-0 border-t pt-4">
                    <div className="flex justify-between mb-4 w-full">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-lg">${calculateTotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="space-y-2 w-full">
                      <Button 
                        className="w-full" 
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                      >
                        Checkout
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/explore">Continue Shopping</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-lg text-neutral-900 mb-4">Supporting Artisans</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Every purchase directly supports master craftspeople and helps preserve traditional skills for future generations.
              </p>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                  </svg>
                  <span>Fair compensation for artisans</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                  </svg>
                  <span>Authentic handcrafted items</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                  </svg>
                  <span>Traditional techniques preserved</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                  </svg>
                  <span>Sustainability focused production</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
