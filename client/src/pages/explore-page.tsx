import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Course } from "@shared/schema";
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
import { Clock, Video, Search, Filter } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";

export default function ExplorePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [
    "all",
    "Woodworking",
    "Leatherwork",
    "Blacksmithing",
    "Culinary",
    "Textile Arts",
    "Ceramics",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRequest("GET", "/api/courses");
        const data = await res.json();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        setError("Failed to load courses");
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((course) => course.category === categoryFilter);
    }

    setFilteredCourses(filtered);
  }, [searchQuery, categoryFilter, courses]);

  return (
    <MainLayout>
      <div className="pt-20 bg-neutral-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Explore Knowledge Paths
            </h1>
            <p className="text-neutral-600 max-w-2xl">
              Discover timeless courses crafted by master artisans and craftspeople from generations past.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <div className="lg:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
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
          </div>

          {/* Loading or Error */}
          {loading && <LoadingPage />}
          {error && <div className="text-center text-red-500 py-10">{error}</div>}

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No courses found
              </h3>
              <p className="text-neutral-600">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition"
                >
                  <div className="relative pb-[56.25%]">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {course.category}
                      </span>
                      <h3 className="text-white text-lg font-semibold mt-2">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 font-bold rounded-full flex items-center justify-center mr-3">
                        {course.instructorId}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          Instructor #{course.instructorId}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Master Craftsman
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-neutral-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Video className="h-4 w-4" /> {course.lessonCount} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {course.duration}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-primary font-semibold">${Number(course.price)}</p>
                      <Button asChild className="text-sm font-medium">
                        <Link href={`/course/${course.id}`}>View Course</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
