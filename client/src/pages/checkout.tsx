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
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/marketplace" className="inline-flex items-center text-primary hover:text-primary-700 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to marketplace
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Enter your payment details to complete your purchase</CardDescription>
                </CardHeader>
                <CardContent>
                  {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                      <CheckoutForm />
                    </Elements>
                  ) : (
                    <div className="flex items-center justify-center py-6">
                      <LoadingPage />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1605641532626-3b0dc8f038b9"
                        alt="Hand-Forged Chef's Knife" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-neutral-900">Hand-Forged Chef's Knife</h3>
                      <p className="text-sm text-neutral-500">Artisan #3</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-neutral-600">Qty: 1</span>
                        <span className="font-medium">$129.00</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Subtotal</span>
                      <span>$129.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Tax</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-lg">$129.00</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-neutral-50 text-sm text-neutral-600">
                  <p>
                    You're supporting traditional craftsmanship with this purchase. Thank you for helping preserve these valuable skills!
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
