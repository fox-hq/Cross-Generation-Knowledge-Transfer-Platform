import { useState, useEffect } from "react";
import { Discussion, Showcase, Reply, InsertDiscussion, InsertReply } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, MessageSquare, Heart, Search, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { insertDiscussionSchema, insertReplySchema } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function CommunityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeDiscussion, setActiveDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const categories = ["all", "Woodworking", "Leatherwork", "Blacksmithing", "Culinary", "Textile Arts", "Ceramics"];

  // Create discussion form schema
  const createDiscussionSchema = insertDiscussionSchema.extend({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    category: z.string().min(1, "Please select a category"),
  });

  // Create reply form schema
  const createReplySchema = insertReplySchema.extend({
    content: z.string().min(5, "Reply must be at least 5 characters"),
  });

  // Discussions query
  const { 
    data: discussions = [], 
    isLoading: discussionsLoading, 
    error: discussionsError 
  } = useQuery<Discussion[]>({
    queryKey: ["/api/discussions"],
  });

  // Showcases query
  const { 
    data: showcases = [], 
    isLoading: showcasesLoading, 
    error: showcasesError 
  } = useQuery<Showcase[]>({
    queryKey: ["/api/showcases"],
  });

  // Create discussion form
  const discussionForm = useForm<z.infer<typeof createDiscussionSchema>>({
    resolver: zodResolver(createDiscussionSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      userId: user?.id || 0
    },
  });

  // Create reply form
  const replyForm = useForm<z.infer<typeof createReplySchema>>({
    resolver: zodResolver(createReplySchema),
    defaultValues: {
      content: "",
      discussionId: 0,
      userId: user?.id || 0
    },
  });

  // Create discussion mutation
  const createDiscussionMutation = useMutation({
    mutationFn: async (data: InsertDiscussion) => {
      const res = await apiRequest("POST", "/api/discussions", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions"] });
      toast({
        title: "Discussion created",
        description: "Your discussion has been posted successfully",
      });
      discussionForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create discussion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: async (data: InsertReply) => {
      const res = await apiRequest("POST", `/api/discussions/${data.discussionId}/replies`, data);
      return await res.json();
    },
    onSuccess: () => {
      if (activeDiscussion) {
        fetchReplies(activeDiscussion.id);
      }
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully",
      });
      replyForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to post reply",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Like showcase mutation
  const likeShowcaseMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/showcases/${id}/like`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/showcases"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to like showcase",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch replies for a discussion
  const fetchReplies = async (discussionId: number) => {
    try {
      const res = await apiRequest("GET", `/api/discussions/${discussionId}/replies`);
      const data = await res.json();
      setReplies(data);
    } catch (error) {
      console.error("Error fetching replies:", error);
      toast({
        title: "Failed to load replies",
        description: "There was an error loading the replies for this discussion",
        variant: "destructive",
      });
    }
  };

  // Open discussion with replies
  const openDiscussion = async (discussion: Discussion) => {
    setActiveDiscussion(discussion);
    await fetchReplies(discussion.id);
    
    // Update form default values
    replyForm.setValue("discussionId", discussion.id);
  };

  // Handle discussion form submission
  const onDiscussionSubmit = (data: z.infer<typeof createDiscussionSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a discussion",
        variant: "destructive",
      });
      return;
    }
    
    createDiscussionMutation.mutate({
      ...data,
      userId: user.id
    });
  };

  // Handle reply form submission
  const onReplySubmit = (data: z.infer<typeof createReplySchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a reply",
        variant: "destructive",
      });
      return;
    }
    
    if (!activeDiscussion) {
      toast({
        title: "Error",
        description: "No discussion selected",
        variant: "destructive",
      });
      return;
    }
    
    createReplyMutation.mutate({
      ...data,
      userId: user.id,
      discussionId: activeDiscussion.id
    });
  };

  // Like a showcase
  const handleLikeShowcase = (id: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like showcases",
        variant: "destructive",
      });
      return;
    }
    
    likeShowcaseMutation.mutate(id);
  };

  // Filter discussions based on search and category
  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = searchQuery.length === 0 || 
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || discussion.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Function to format date
  const formatTimeSince = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return '1d ago';
    } else {
      return `${diffDays}d ago`;
    }
  };

  if (discussionsLoading || showcasesLoading) return <LoadingPage />;
  if (discussionsError || showcasesError) return <div className="text-center text-red-500 py-10">Failed to load community data</div>;

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 text-center">Community Hub</h1>
          <p className="mt-4 text-lg text-neutral-600 text-center">
            Connect with fellow learners, share your progress, and get advice from practitioners around the world
          </p>
        </div>
        
        <Tabs defaultValue="discussions" className="max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="showcases">Showcases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex flex-col md:flex-row gap-4 flex-grow">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <Input
                    type="search"
                    placeholder="Search discussions..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Category" />
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
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="whitespace-nowrap">
                    <Plus className="mr-2 h-4 w-4" /> New Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create a Discussion</DialogTitle>
                    <DialogDescription>
                      Share your questions, insights, or challenges with the community.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...discussionForm}>
                    <form onSubmit={discussionForm.handleSubmit(onDiscussionSubmit)} className="space-y-4">
                      <FormField
                        control={discussionForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter a descriptive title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={discussionForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.filter(cat => cat !== "all").map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={discussionForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your question or topic in detail" 
                                rows={6}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4 flex justify-end">
                        <Button 
                          type="submit"
                          disabled={createDiscussionMutation.isPending}
                        >
                          {createDiscussionMutation.isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                          Post Discussion
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              <div className="lg:col-span-3">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Discussions</h2>
                
                {filteredDiscussions.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
                    <p className="text-neutral-600">No discussions found</p>
                    <Button className="mt-4" onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("all");
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDiscussions.map((discussion) => (
                      <Card 
                        key={discussion.id} 
                        className={`cursor-pointer transition-colors hover:border-primary-200 ${
                          activeDiscussion?.id === discussion.id ? 'border-primary' : ''
                        }`}
                        onClick={() => openDiscussion(discussion)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-4">
                              <span className="font-bold">{discussion.userId.toString().charAt(0)}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-neutral-900">{discussion.title}</h4>
                                <span className="text-sm text-neutral-500">{formatTimeSince(discussion.createdAt)}</span>
                              </div>
                              <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{discussion.content}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-neutral-500">
                                  <span className="flex items-center">
                                    <MessageSquare className="mr-1.5 h-4 w-4" /> {replies.length} replies
                                  </span>
                                  <span className="flex items-center">
                                    <Eye className="mr-1.5 h-4 w-4" /> {discussion.views} views
                                  </span>
                                </div>
                                <span className="text-xs font-medium px-2.5 py-0.5 bg-primary-100 text-primary-800 rounded-full">
                                  {discussion.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-4">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Discussion Details</h2>
                
                {!activeDiscussion ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-neutral-600 mb-2">Select a discussion to view details</p>
                      <p className="text-neutral-400 text-sm">Click on any discussion from the list to view its content and replies</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle>{activeDiscussion.title}</CardTitle>
                          <span className="text-xs font-medium px-2.5 py-0.5 bg-primary-100 text-primary-800 rounded-full h-fit">
                            {activeDiscussion.category}
                          </span>
                        </div>
                        <CardDescription>
                          Posted by User #{activeDiscussion.userId} • {formatTimeSince(activeDiscussion.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-neutral-700 whitespace-pre-line">{activeDiscussion.content}</p>
                      </CardContent>
                      <CardFooter className="border-t border-neutral-100 pt-4 text-sm text-neutral-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <MessageSquare className="mr-1.5 h-4 w-4" /> {replies.length} replies
                          </span>
                          <span className="flex items-center">
                            <Eye className="mr-1.5 h-4 w-4" /> {activeDiscussion.views} views
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-neutral-900">Replies</h3>
                      
                      {replies.length === 0 ? (
                        <p className="text-neutral-600 text-center py-4">No replies yet. Be the first to reply!</p>
                      ) : (
                        replies.map((reply) => (
                          <Card key={reply.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-3">
                                  <span className="font-bold text-sm">{reply.userId.toString().charAt(0)}</span>
                                </div>
                                <div>
                                  <div className="flex items-center mb-1">
                                    <span className="font-medium text-sm">User #{reply.userId}</span>
                                    <span className="text-xs text-neutral-500 ml-2">{formatTimeSince(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-neutral-700">{reply.content}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Add your reply</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Form {...replyForm}>
                            <form onSubmit={replyForm.handleSubmit(onReplySubmit)} className="space-y-4">
                              <FormField
                                control={replyForm.control}
                                name="content"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Share your thoughts or expertise..."
                                        rows={3}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="flex justify-end">
                                <Button 
                                  type="submit"
                                  disabled={createReplyMutation.isPending || !user}
                                >
                                  {createReplyMutation.isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                  Post Reply
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="showcases">
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-neutral-900">Learner Showcases</h2>
              <Button disabled>
                <Plus className="mr-2 h-4 w-4" /> Share Your Work
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {showcases.map((showcase) => (
                <Card key={showcase.id} className="overflow-hidden">
                  <div className="h-48 w-full">
                    <img 
                      src={showcase.imageUrl}
                      alt={showcase.title} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-neutral-900 mb-1">{showcase.title}</h4>
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{showcase.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary flex items-center justify-center mr-2">
                          <span className="text-xs font-bold">{showcase.userId.toString().charAt(0)}</span>
                        </div>
                        <span className="text-xs text-neutral-500">User #{showcase.userId}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleLikeShowcase(showcase.id)}
                        className="text-neutral-500 hover:text-red-500"
                      >
                        <Heart className="mr-1 h-4 w-4" />
                        <span className="text-xs">{showcase.likes}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
