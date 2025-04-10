import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Mic, Copy, FileText, CheckCircle2 } from "lucide-react";

interface TranscriptionResult {
  title: string;
  sections: Array<{ heading: string; content: string }>;
}

export default function TranscriptionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);

  const handleTranscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use the transcription service",
        variant: "destructive",
      });
      return;
    }

    if (!inputText.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter some content to transcribe",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiRequest("POST", "/api/transcribe", { content: inputText });
      const data = await res.json();
      setTranscriptionResult(data.structuredContent);
      
      toast({
        title: "Transcription complete",
        description: "Your content has been successfully transcribed and structured",
      });
    } catch (error: any) {
      toast({
        title: "Transcription failed",
        description: error.message || "There was an error processing your content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Content copied successfully",
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy text: " + err,
          variant: "destructive",
        });
      }
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInputText(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-neutral-900">AI-Assisted Transcription</h1>
            <p className="mt-4 text-lg text-neutral-600">
              Preserve and structure knowledge from experienced craftspeople using our AI-powered transcription tool
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Input Content</CardTitle>
                  <CardDescription>
                    Enter raw content from interviews, demonstrations, or notes that you'd like to transcribe and structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="text">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="text">Text Input</TabsTrigger>
                      <TabsTrigger value="upload">File Upload</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text">
                      <Textarea
                        placeholder="Paste your raw interview content, notes, or descriptions here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={12}
                        className="resize-none mb-4"
                      />
                    </TabsContent>
                    
                    <TabsContent value="upload">
                      <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center mb-4">
                        <FileText className="h-10 w-10 text-neutral-400 mx-auto mb-2" />
                        <p className="text-neutral-600 mb-4">Upload a text file containing your content</p>
                        <Input
                          type="file"
                          accept=".txt,.doc,.docx,.md"
                          className="max-w-xs mx-auto"
                          onChange={handleFileUpload}
                        />
                      </div>
                      
                      {inputText && (
                        <div className="mt-4">
                          <p className="text-sm text-neutral-600 mb-2">File content preview:</p>
                          <div className="bg-neutral-50 p-3 rounded-md text-sm max-h-40 overflow-y-auto">
                            {inputText.substring(0, 500)}
                            {inputText.length > 500 && "..."}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleTranscribe} 
                    disabled={isSubmitting || !inputText.trim()}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Transcribe Content
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">How It Works</h3>
                <ol className="space-y-3 text-neutral-600">
                  <li className="flex">
                    <span className="font-bold text-primary mr-2">1.</span>
                    <span>Enter or upload your raw content from interviews, demonstrations, or notes</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-primary mr-2">2.</span>
                    <span>Our AI analyzes the content and identifies key information</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-primary mr-2">3.</span>
                    <span>The content is structured into a clear, organized format with sections and headings</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-primary mr-2">4.</span>
                    <span>Review, edit, and save the structured content for future reference or sharing</span>
                  </li>
                </ol>
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Structured Output</CardTitle>
                  <CardDescription>
                    AI-enhanced transcription with organized sections and improved readability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transcriptionResult ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-neutral-900">{transcriptionResult.title}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(
                            `# ${transcriptionResult.title}\n\n` + 
                            transcriptionResult.sections.map(section => 
                              `## ${section.heading}\n${section.content}`
                            ).join('\n\n')
                          )}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy all
                        </Button>
                      </div>
                      
                      <div className="bg-neutral-50 p-4 rounded-lg space-y-4 max-h-[500px] overflow-y-auto">
                        {transcriptionResult.sections.map((section, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-neutral-800">{section.heading}</h4>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7" 
                                onClick={() => copyToClipboard(section.content)}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <p className="text-neutral-700 whitespace-pre-line text-sm">{section.content}</p>
                            {index < transcriptionResult.sections.length - 1 && (
                              <hr className="border-neutral-200" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[450px] flex flex-col items-center justify-center text-center">
                      <CheckCircle2 className="h-16 w-16 text-neutral-200 mb-4" />
                      <h3 className="text-lg font-medium text-neutral-700 mb-1">No Content Processed Yet</h3>
                      <p className="text-neutral-500 max-w-md">
                        Enter your content in the input area and click "Transcribe Content" to see the structured output here.
                      </p>
                    </div>
                  )}
                </CardContent>
                {transcriptionResult && (
                  <CardFooter className="justify-between">
                    <p className="text-sm text-neutral-500">
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                    <Button variant="outline" size="sm">
                      Save to Library
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              {transcriptionResult && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Content Successfully Processed</h4>
                      <p className="text-sm text-green-700">
                        Your content has been structured into {transcriptionResult.sections.length} sections. This knowledge is now preserved in an organized, accessible format.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
