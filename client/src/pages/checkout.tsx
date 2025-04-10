import { useEffect, useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Payment succeeded
        setPaymentSuccess(true);
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Payment Successful!</h2>
        <p className="text-neutral-600 mb-6">Thank you for your purchase.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/marketplace">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Complete Payment"}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const res = await apiRequest("POST", "/api/create-payment-intent", { amount: 129 });
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        setError(error.message || "Failed to initialize payment");
        toast({
          title: "Payment Setup Failed",
          description: "There was an error setting up the payment. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [toast]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Payment Error</h2>
        <p className="text-neutral-700 mb-6">{error}</p>
        <Button asChild>
          <Link href="/marketplace">Return to Marketplace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/marketplace" className="inline-flex items-center text-primary hover:text-primary-600 hover:underline transition">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to marketplace
            </Link>
            <div className="text-right">
              <div className="text-sm text-neutral-500">Secure Payment</div>
              <div className="flex items-center space-x-2 mt-1">
                <svg className="h-5 w-auto" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="40" rx="4" fill="#252525"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M30 28C33.866 28 37 24.866 37 21C37 17.134 33.866 14 30 14C26.134 14 23 17.134 23 21C23 24.866 26.134 28 30 28Z" fill="#EB001B"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M30 28C33.866 28 37 24.866 37 21C37 17.134 33.866 14 30 14C26.134 14 23 17.134 23 21C23 24.866 26.134 28 30 28Z" fill="#F79E1B" fillOpacity="0.8"/>
                </svg>
                <svg className="h-5 w-auto" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="40" rx="4" fill="#016FD0"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M23 26H37V16H23V26Z" fill="white"/>
                </svg>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286z" />
                </svg>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-10 text-gradient-primary">Complete Your Purchase</h1>
          
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-neutral-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100">
              {/* Payment Section */}
              <div className="lg:col-span-7 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 mb-1">Payment Information</h2>
                  <p className="text-neutral-500 text-sm">All transactions are secure and encrypted</p>
                </div>
                
                <div className="bg-neutral-50 p-6 rounded-xl mb-6">
                  {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ 
                      clientSecret, 
                      appearance: { 
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#9333ea',
                          colorBackground: '#f9fafb',
                          colorText: '#1f2937',
                          colorDanger: '#ef4444',
                          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                          borderRadius: '8px',
                          spacingUnit: '4px',
                        }
                      } 
                    }}>
                      <CheckoutForm />
                    </Elements>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
              
              {/* Order Summary Section */}
              <div className="lg:col-span-5 bg-neutral-50 p-6 md:p-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h2>
                
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                        <img 
                          src="https://images.unsplash.com/photo-1605641532626-3b0dc8f038b9"
                          alt="Hand-Forged Chef's Knife" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900">Hand-Forged Chef's Knife</h3>
                        <p className="text-sm text-neutral-600 mb-1">Traditional Blacksmith Crafted</p>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-neutral-500">Qty: 1</span>
                          <span className="font-semibold text-primary">$129.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Subtotal</span>
                      <span className="font-medium">$129.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Tax</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">$129.00</span>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-primary">Supporting Craftsmanship</h3>
                        <p className="mt-1 text-sm text-neutral-600">
                          Your purchase directly supports traditional artisans and helps preserve valuable cultural knowledge for future generations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
