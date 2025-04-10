import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mic, Edit, Users, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Capture",
      description: "We document the skills and knowledge of master craftspeople through interviews and demonstrations"
    },
    {
      icon: <Edit className="h-6 w-6" />,
      title: "Create",
      description: "Our team transforms raw knowledge into structured, interactive learning experiences"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Connect",
      description: "Learners engage with content, mentors, and a community of like-minded practitioners"
    }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: 'rgba(9,9,11,255)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">How CraftBridge Works</h2>
          <p className="mt-4 text-lg text-neutral-300 max-w-3xl mx-auto">
            Our platform connects masters and apprentices through a structured knowledge transfer process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="glass-dark p-6 rounded-lg shadow-md text-center border border-neutral-800">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                index === 0 
                  ? "bg-primary/20 text-primary" 
                  : index === 1 
                  ? "bg-green-900/30 text-green-400" 
                  : "bg-amber-900/30 text-amber-400"
              }`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-neutral-300">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="text-white border-white/30 hover:bg-white/10 hover:border-white/50"
          >
            <Link href="/explore" className="font-medium inline-flex items-center">
              Learn more about our process
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
