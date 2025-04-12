
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ValidateWorkPage() {
  const [work, setWork] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Validate Work</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your work here..."
            value={work}
            onChange={(e) => setWork(e.target.value)}
            className="mb-4"
          />
          <Button>Submit for Validation</Button>
        </CardContent>
      </Card>
    </div>
  );
}
