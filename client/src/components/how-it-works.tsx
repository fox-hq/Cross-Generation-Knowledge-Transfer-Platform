import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mic, Edit, Users } from "lucide-react";

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
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900">How CraftBridge Works</h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            Our platform connects masters and apprentices through a structured knowledge transfer process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                index === 0 
                  ? "bg-primary-100 text-primary" 
                  : index === 1 
                  ? "bg-green-100 text-green-600" 
                  : "bg-amber-100 text-amber-600"
              }`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/explore">Learn more about our process</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
