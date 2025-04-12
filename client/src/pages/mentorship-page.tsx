import { useState, useEffect } from "react";
import { Mentorship } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Search, Filter, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function MentorshipPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [filteredMentorships, setFilteredMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMentorship, setSelectedMentorship] = useState<Mentorship | null>(null);

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", 
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  useEffect(() => {
    const fetchMentorships = async () => {
      try {
        const res = await apiRequest("GET", "/api/mentorships");
        const data = await res.json();
        setMentorships(data);
        setFilteredMentorships(data);
      } catch (error) {
        setError("Failed to load mentorships");
        console.error("Error fetching mentorships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorships();
  }, []);

  useEffect(() => {
    // Filter mentorships based on search query and price filter
    let filtered = mentorships;
    
    if (searchQuery) {
      filtered = filtered.filter(mentorship => 
        mentorship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentorship.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "under75":
          filtered = filtered.filter(mentorship => Number(mentorship.price) < 75);
          break;
        case "75to90":
          filtered = filtered.filter(mentorship => Number(mentorship.price) >= 75 && Number(mentorship.price) <= 90);
          break;
        case "over90":
          filtered = filtered.filter(mentorship => Number(mentorship.price) > 90);
          break;
      }
    }
    
    setFilteredMentorships(filtered);
  }, [searchQuery, priceFilter, mentorships]);

  const handleBookSession = (mentorship: Mentorship) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book a mentorship session",
        variant: "destructive",
      });
      return;
    }

    setSelectedMentorship(mentorship);
  };

  const handleConfirmBooking = () => {
    if (!date || !selectedTime || !selectedMentorship) {
      toast({
        title: "Incomplete booking details",
        description: "Please select both a date and time for your session.",
        variant: "destructive",
      });
      return;
    }

    // Here we would typically make an API call to book the session
    toast({
      title: "Session booked successfully!",
      description: `Your session with Mentor #${selectedMentorship.mentorId} is scheduled for ${format(date, "PPP")} at ${selectedTime}.`,
    });
    
    // Reset form
    setDate(undefined);
    setSelectedTime("");
    setSelectedMentorship(null);
  };

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900">Connect with Master Craftspeople</h1>
          <p className="mt-4 text-lg text-neutral-600">
            Get personalized guidance from experts who have decades of experience in their crafts
          </p>
        </div>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search mentors..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:w-64">
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by price" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under75">Under $75</SelectItem>
                <SelectItem value="75to90">$75 - $90</SelectItem>
                <SelectItem value="over90">Over $90</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredMentorships.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No mentorships found</h3>
            <p className="text-neutral-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMentorships.map((mentorship) => (
              <div key={mentorship.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={mentorship.imageUrl}
                    alt={mentorship.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm bg-primary-100 text-primary flex items-center justify-center mr-4 -mt-12">
                      <span className="font-bold">{mentorship.mentorId}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-neutral-900">Mentor #{mentorship.mentorId}</h3>
                      <p className="text-neutral-600 text-sm">{mentorship.title}</p>
                    </div>
                  </div>
                  
                  <p className="text-neutral-600 mb-5">{mentorship.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">${Number(mentorship.price)} / {mentorship.duration}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => handleBookSession(mentorship)}>Book Session</Button>
                      </DialogTrigger>
                      {selectedMentorship?.id === mentorship.id && (
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Book a Mentorship Session</DialogTitle>
                            <DialogDescription>
                              Select a date and time to schedule your session with Mentor #{mentorship.mentorId}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Select a date:</h4>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : "Select a date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Select a time:</h4>
                              <Select value={selectedTime} onValueChange={setSelectedTime}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a time slot" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="pt-4 border-t border-neutral-200">
                              <div className="flex justify-between mb-3">
                                <span>Session fee:</span>
                                <span className="font-medium">${Number(mentorship.price)}</span>
                              </div>
                              <Button 
                                className="w-full" 
                                onClick={handleConfirmBooking}
                                disabled={!date || !selectedTime}
                              >
                                Confirm Booking
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-16 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Share Your Knowledge</h2>
          <p className="text-neutral-600 mb-6">
            If you have valuable traditional skills and knowledge that you'd like to share with the next generation, you can either become a mentor or create your own course.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="sm:flex-1">Apply to Become a Mentor</Button>
            <Button 
              variant="default" 
              className="sm:flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => window.location.href = '/create-course'}
            >
              Create Your Course
            </Button>
            <Button variant="outline" className="sm:flex-1">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
