
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThreeDLearningPage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="max-w-4xl mx-auto mt-24">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl md:text-4xl">3D Learning Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600 text-lg">Explore crafts and skills through interactive 3D models and simulations.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
