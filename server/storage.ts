import {
  User, InsertUser,
  Course, InsertCourse,
  Mentorship, InsertMentorship,
  Transcription, InsertTranscription,
  Product, InsertProduct,
  Discussion, InsertDiscussion,
  Reply, InsertReply,
  Showcase, InsertShowcase
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course methods
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCoursesByInstructor(instructorId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Mentorship methods
  getMentorships(): Promise<Mentorship[]>;
  getMentorship(id: number): Promise<Mentorship | undefined>;
  getMentorshipsByMentor(mentorId: number): Promise<Mentorship[]>;
  createMentorship(mentorship: InsertMentorship): Promise<Mentorship>;
  
  // Transcription methods
  getTranscriptions(userId: number): Promise<Transcription[]>;
  getTranscription(id: number): Promise<Transcription | undefined>;
  createTranscription(transcription: InsertTranscription): Promise<Transcription>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Discussion methods
  getDiscussions(): Promise<Discussion[]>;
  getDiscussion(id: number): Promise<Discussion | undefined>;
  getDiscussionsByCategory(category: string): Promise<Discussion[]>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  incrementDiscussionViews(id: number): Promise<void>;
  
  // Reply methods
  getRepliesByDiscussion(discussionId: number): Promise<Reply[]>;
  createReply(reply: InsertReply): Promise<Reply>;
  
  // Showcase methods
  getShowcases(): Promise<Showcase[]>;
  getShowcase(id: number): Promise<Showcase | undefined>;
  getShowcasesByUser(userId: number): Promise<Showcase[]>;
  createShowcase(showcase: InsertShowcase): Promise<Showcase>;
  incrementShowcaseLikes(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private mentorships: Map<number, Mentorship>;
  private transcriptions: Map<number, Transcription>;
  private products: Map<number, Product>;
  private discussions: Map<number, Discussion>;
  private replies: Map<number, Reply>;
  private showcases: Map<number, Showcase>;
  
  sessionStore: session.Store;
  currentUserId: number;
  currentCourseId: number;
  currentMentorshipId: number;
  currentTranscriptionId: number;
  currentProductId: number;
  currentDiscussionId: number;
  currentReplyId: number;
  currentShowcaseId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.mentorships = new Map();
    this.transcriptions = new Map();
    this.products = new Map();
    this.discussions = new Map();
    this.replies = new Map();
    this.showcases = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentMentorshipId = 1;
    this.currentTranscriptionId = 1;
    this.currentProductId = 1;
    this.currentDiscussionId = 1;
    this.currentReplyId = 1;
    this.currentShowcaseId = 1;
    
    // Add some sample data
    this.initSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Course methods
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async getCoursesByInstructor(instructorId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.instructorId === instructorId,
    );
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }
  
  // Mentorship methods
  async getMentorships(): Promise<Mentorship[]> {
    return Array.from(this.mentorships.values());
  }
  
  async getMentorship(id: number): Promise<Mentorship | undefined> {
    return this.mentorships.get(id);
  }
  
  async getMentorshipsByMentor(mentorId: number): Promise<Mentorship[]> {
    return Array.from(this.mentorships.values()).filter(
      (mentorship) => mentorship.mentorId === mentorId,
    );
  }
  
  async createMentorship(insertMentorship: InsertMentorship): Promise<Mentorship> {
    const id = this.currentMentorshipId++;
    const mentorship: Mentorship = { ...insertMentorship, id };
    this.mentorships.set(id, mentorship);
    return mentorship;
  }
  
  // Transcription methods
  async getTranscriptions(userId: number): Promise<Transcription[]> {
    return Array.from(this.transcriptions.values()).filter(
      (transcription) => transcription.userId === userId,
    );
  }
  
  async getTranscription(id: number): Promise<Transcription | undefined> {
    return this.transcriptions.get(id);
  }
  
  async createTranscription(insertTranscription: InsertTranscription): Promise<Transcription> {
    const id = this.currentTranscriptionId++;
    const now = new Date();
    const transcription: Transcription = { 
      ...insertTranscription, 
      id,
      createdAt: now
    };
    this.transcriptions.set(id, transcription);
    return transcription;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.sellerId === sellerId,
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  // Discussion methods
  async getDiscussions(): Promise<Discussion[]> {
    return Array.from(this.discussions.values());
  }
  
  async getDiscussion(id: number): Promise<Discussion | undefined> {
    return this.discussions.get(id);
  }
  
  async getDiscussionsByCategory(category: string): Promise<Discussion[]> {
    return Array.from(this.discussions.values()).filter(
      (discussion) => discussion.category === category,
    );
  }
  
  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const id = this.currentDiscussionId++;
    const now = new Date();
    const discussion: Discussion = { 
      ...insertDiscussion, 
      id,
      createdAt: now,
      views: 0
    };
    this.discussions.set(id, discussion);
    return discussion;
  }
  
  async incrementDiscussionViews(id: number): Promise<void> {
    const discussion = this.discussions.get(id);
    if (discussion) {
      discussion.views += 1;
      this.discussions.set(id, discussion);
    }
  }
  
  // Reply methods
  async getRepliesByDiscussion(discussionId: number): Promise<Reply[]> {
    return Array.from(this.replies.values()).filter(
      (reply) => reply.discussionId === discussionId,
    );
  }
  
  async createReply(insertReply: InsertReply): Promise<Reply> {
    const id = this.currentReplyId++;
    const now = new Date();
    const reply: Reply = { 
      ...insertReply, 
      id,
      createdAt: now
    };
    this.replies.set(id, reply);
    return reply;
  }
  
  // Showcase methods
  async getShowcases(): Promise<Showcase[]> {
    return Array.from(this.showcases.values());
  }
  
  async getShowcase(id: number): Promise<Showcase | undefined> {
    return this.showcases.get(id);
  }
  
  async getShowcasesByUser(userId: number): Promise<Showcase[]> {
    return Array.from(this.showcases.values()).filter(
      (showcase) => showcase.userId === userId,
    );
  }
  
  async createShowcase(insertShowcase: InsertShowcase): Promise<Showcase> {
    const id = this.currentShowcaseId++;
    const now = new Date();
    const showcase: Showcase = { 
      ...insertShowcase, 
      id,
      createdAt: now,
      likes: 0
    };
    this.showcases.set(id, showcase);
    return showcase;
  }
  
  async incrementShowcaseLikes(id: number): Promise<void> {
    const showcase = this.showcases.get(id);
    if (showcase) {
      showcase.likes += 1;
      this.showcases.set(id, showcase);
    }
  }
  
  private initSampleData() {
    // Create sample users for masters/instructors
    const john = this.createUser({
      username: "johncarpenter",
      password: "password123", // This would be hashed in production
      email: "john@example.com",
      fullName: "John Carpenter",
      role: "instructor"
    });
    
    const maria = this.createUser({
      username: "mariatanners",
      password: "password123", // This would be hashed in production
      email: "maria@example.com",
      fullName: "Maria Tanners",
      role: "instructor"
    });
    
    const robert = this.createUser({
      username: "robertjohnson",
      password: "password123", // This would be hashed in production
      email: "robert@example.com",
      fullName: "Robert Johnson",
      role: "instructor"
    });
    
    // Create sample courses
    this.createCourse({
      title: "Traditional Woodworking Fundamentals",
      description: "Learn the fundamentals of traditional woodworking with hand tools and classic techniques.",
      category: "Woodworking",
      price: 89,
      imageUrl: "https://images.unsplash.com/photo-1545062156-9e0f7c63e550",
      instructorId: 1,
      duration: "8 hours",
      lessonCount: 24
    });
    
    this.createCourse({
      title: "Traditional Leather Crafting Techniques",
      description: "Master the art of traditional leather crafting with expert techniques and tools.",
      category: "Leatherwork",
      price: 75,
      imageUrl: "https://images.unsplash.com/photo-1551614336-06746a69c6c6",
      instructorId: 2,
      duration: "6 hours",
      lessonCount: 18
    });
    
    this.createCourse({
      title: "Ancestral Cooking Methods",
      description: "Explore traditional cooking methods and recipes passed down through generations.",
      category: "Culinary",
      price: 79,
      imageUrl: "https://images.unsplash.com/photo-1607395411669-b5b8cc1e6d89",
      instructorId: 3,
      duration: "7 hours",
      lessonCount: 20
    });
    
    this.createCourse({
      title: "Traditional Blacksmithing: Forging Heritage Tools",
      description: "Master blacksmith Robert Johnson shares his 45 years of experience forging traditional tools using techniques passed down through generations.",
      category: "Blacksmithing",
      price: 129,
      imageUrl: "https://images.unsplash.com/photo-1559825481-12a05cc00344",
      instructorId: 3,
      duration: "12 hours",
      lessonCount: 24
    });
    
    // Create sample mentorships
    this.createMentorship({
      mentorId: 1,
      title: "Traditional Woodworker",
      description: "Specializing in hand-tool woodworking and joinery techniques from the 18th and 19th centuries. 40+ years of experience.",
      price: 75,
      duration: "60-min session",
      imageUrl: "https://images.unsplash.com/photo-1574359411659-11a1e4c57220"
    });
    
    this.createMentorship({
      mentorId: 2,
      title: "Master Leatherworker",
      description: "Expert in traditional European leather crafting techniques with focus on saddlery and fine leather goods. 35+ years of experience.",
      price: 85,
      duration: "60-min session",
      imageUrl: "https://images.unsplash.com/photo-1551614336-06746a69c6c6"
    });
    
    this.createMentorship({
      mentorId: 3,
      title: "Master Blacksmith",
      description: "Carries on the tradition of creating hand-forged tools, architectural elements, and decorative ironwork. 45+ years of experience.",
      price: 90,
      duration: "60-min session",
      imageUrl: "https://images.unsplash.com/photo-1559825481-12a05cc00344"
    });
    
    // Create sample products
    this.createProduct({
      sellerId: 1,
      title: "Hand-Carved Cherry Wood Bowl",
      description: "Traditionally crafted from a single piece of cherry wood using historic techniques and tools.",
      price: 89,
      category: "Woodworking",
      imageUrl: "https://images.unsplash.com/photo-1560090995-01632a28895b"
    });
    
    this.createProduct({
      sellerId: 2,
      title: "Hand-Bound Leather Journal",
      description: "Traditional Florentine binding with hand-stitched spine and acid-free cotton paper.",
      price: 65,
      category: "Leatherwork",
      imageUrl: "https://images.unsplash.com/photo-1551614336-3edcddd8a5e9"
    });
    
    this.createProduct({
      sellerId: 3,
      title: "Hand-Forged Chef's Knife",
      description: "Carbon steel blade with traditional walnut handle, forged using historic blacksmithing techniques.",
      price: 175,
      category: "Blacksmithing",
      imageUrl: "https://images.unsplash.com/photo-1605641532626-3b0dc8f038b9"
    });
    
    this.createProduct({
      sellerId: 2,
      title: "Traditional Willow Basket",
      description: "Hand-woven using traditional English basketry techniques with sustainably harvested willow.",
      price: 95,
      category: "Basketry",
      imageUrl: "https://images.unsplash.com/photo-1604541309958-c8063f56d2a2"
    });
    
    // Create sample discussions
    const discussion1 = this.createDiscussion({
      userId: 1,
      title: "Best wood for beginner carving projects?",
      content: "I'm just getting started with wood carving and wondering what types of wood are best for beginners. Any suggestions from experienced carvers?",
      category: "Woodworking"
    });
    
    const discussion2 = this.createDiscussion({
      userId: 2,
      title: "Traditional indigo dyeing process",
      content: "I'm trying to recreate an authentic indigo dyeing process and struggling with getting consistent results. Has anyone here mastered this technique?",
      category: "Textile Arts"
    });
    
    const discussion3 = this.createDiscussion({
      userId: 3,
      title: "Finding authentic clay for traditional pottery",
      content: "Does anyone know good sources for traditional clay that would be similar to what was used historically? I'm trying to recreate authentic techniques.",
      category: "Ceramics"
    });
    
    // Create sample replies
    this.createReply({
      discussionId: discussion1.id,
      userId: 3,
      content: "Basswood is excellent for beginners. It's soft enough to carve easily but has enough integrity to hold detail."
    });
    
    this.createReply({
      discussionId: discussion1.id,
      userId: 2,
      content: "I always recommend starting with lime wood or pine. They're forgiving but still give you a good feel for the process."
    });
    
    // Create sample showcases
    this.createShowcase({
      userId: 1,
      title: "My first hand-carved wooden spoon",
      description: "After 3 weeks of practice, I finally completed my first spoon using traditional carving techniques!",
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261"
    });
    
    this.createShowcase({
      userId: 2,
      title: "Traditional Windsor chair completed!",
      description: "Six months of learning from John Carpenter's course and I've finished my first authentic Windsor chair.",
      imageUrl: "https://images.unsplash.com/photo-1574359411659-11a1e4c57220"
    });
    
    this.createShowcase({
      userId: 3,
      title: "First attempt at traditional weaving",
      description: "Learning to use a traditional loom has been challenging but rewarding. Here's my first completed textile!",
      imageUrl: "https://images.unsplash.com/photo-1475274226786-e636f48a5645"
    });
    
    this.createShowcase({
      userId: 1,
      title: "Hand-bound leather journal",
      description: "Following Maria's leatherworking course, I created this journal using traditional binding techniques.",
      imageUrl: "https://images.unsplash.com/photo-1551614336-06746a69c6c6"
    });
  }
}

export const storage = new MemStorage();
