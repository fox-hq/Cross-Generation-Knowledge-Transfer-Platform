import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function JoinCommunitySection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Thank you for joining our community!",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-primary-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community of Learners and Masters</h2>
          <p className="text-lg text-primary-100 mb-8">Be part of preserving traditional crafts and skills for future generations</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center mb-6 gap-3">
            <Input
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-96 bg-white text-neutral-900 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Get Started"}
            </Button>
          </form>
          
          <p className="text-sm text-primary-200">No credit card required. Start exploring free content today.</p>
        </div>
      </div>
    </section>
  );
}
