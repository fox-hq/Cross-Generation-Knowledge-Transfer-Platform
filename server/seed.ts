import { db } from './db';
import { users, courses, mentorships, products, discussions, replies, showcases } from '@shared/schema';
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Helper function to hash passwords
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedDatabase() {
  // Check if data already exists
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  console.log("Seeding database with initial data...");

  try {
    // Create users
    const [john] = await db.insert(users).values({
      username: "johncarpenter",
      password: await hashPassword("password123"),
      email: "john@example.com",
      fullName: "John Carpenter",
      role: "instructor",
      profileImage: null,
      bio: null,
      expertise: "Woodworking",
      yearsOfExperience: 40
    }).returning();

    const [maria] = await db.insert(users).values({
      username: "mariatanners",
      password: await hashPassword("password123"),
      email: "maria@example.com",
      fullName: "Maria Tanners",
      role: "instructor",
      profileImage: null,
      bio: null,
      expertise: "Leatherwork",
      yearsOfExperience: 35
    }).returning();

    const [robert] = await db.insert(users).values({
      username: "robertjohnson",
      password: await hashPassword("password123"),
      email: "robert@example.com",
      fullName: "Robert Johnson",
      role: "instructor",
      profileImage: null,
      bio: null,
      expertise: "Blacksmithing",
      yearsOfExperience: 45
    }).returning();

    // Create courses
    await db.insert(courses).values([
      {
        title: "Traditional Woodworking Fundamentals",
        description: "Learn the fundamentals of traditional woodworking with hand tools and classic techniques.",
        category: "Woodworking",
        price: "89",
        imageUrl: "https://images.unsplash.com/photo-1545062156-9e0f7c63e550",
        instructorId: john.id,
        duration: "8 hours",
        lessonCount: 24
      },
      {
        title: "Traditional Leather Crafting Techniques",
        description: "Master the art of traditional leather crafting with expert techniques and tools.",
        category: "Leatherwork",
        price: "75",
        imageUrl: "https://images.unsplash.com/photo-1551614336-06746a69c6c6",
        instructorId: maria.id,
        duration: "6 hours",
        lessonCount: 18
      },
      {
        title: "Ancestral Cooking Methods",
        description: "Explore traditional cooking methods and recipes passed down through generations.",
        category: "Culinary",
        price: "79",
        imageUrl: "https://images.unsplash.com/photo-1607395411669-b5b8cc1e6d89",
        instructorId: robert.id,
        duration: "7 hours",
        lessonCount: 20
      },
      {
        title: "Traditional Blacksmithing: Forging Heritage Tools",
        description: "Master blacksmith Robert Johnson shares his 45 years of experience forging traditional tools using techniques passed down through generations.",
        category: "Blacksmithing",
        price: "129",
        imageUrl: "https://images.unsplash.com/photo-1559825481-12a05cc00344",
        instructorId: robert.id,
        duration: "12 hours",
        lessonCount: 24
      }
    ]);

    // Create mentorships
    await db.insert(mentorships).values([
      {
        mentorId: john.id,
        title: "Traditional Woodworker",
        description: "Specializing in hand-tool woodworking and joinery techniques from the 18th and 19th centuries. 40+ years of experience.",
        price: "75",
        duration: "60-min session",
        imageUrl: "https://images.unsplash.com/photo-1574359411659-11a1e4c57220"
      },
      {
        mentorId: maria.id,
        title: "Master Leatherworker",
        description: "Expert in traditional European leather crafting techniques with focus on saddlery and fine leather goods. 35+ years of experience.",
        price: "85",
        duration: "60-min session",
        imageUrl: "https://images.unsplash.com/photo-1551614336-06746a69c6c6"
      },
      {
        mentorId: robert.id,
        title: "Master Blacksmith",
        description: "Carries on the tradition of creating hand-forged tools, architectural elements, and decorative ironwork. 45+ years of experience.",
        price: "90",
        duration: "60-min session",
        imageUrl: "https://images.unsplash.com/photo-1559825481-12a05cc00344"
      }
    ]);

    // Create products
    await db.insert(products).values([
      {
        sellerId: john.id,
        title: "Hand-Carved Cherry Wood Bowl",
        description: "Traditionally crafted from a single piece of cherry wood using historic techniques and tools.",
        price: "89",
        category: "Woodworking",
        imageUrl: "https://images.unsplash.com/photo-1560090995-01632a28895b"
      },
      {
        sellerId: maria.id,
        title: "Hand-Bound Leather Journal",
        description: "Traditional Florentine binding with hand-stitched spine and acid-free cotton paper.",
        price: "65",
        category: "Leatherwork",
        imageUrl: "https://images.unsplash.com/photo-1551614336-3edcddd8a5e9"
      },
      {
        sellerId: robert.id,
        title: "Hand-Forged Chef's Knife",
        description: "Carbon steel blade with traditional walnut handle, forged using historic blacksmithing techniques.",
        price: "175",
        category: "Blacksmithing",
        imageUrl: "https://images.unsplash.com/photo-1605641532626-3b0dc8f038b9"
      },
      {
        sellerId: maria.id,
        title: "Traditional Willow Basket",
        description: "Hand-woven using traditional English basketry techniques with sustainably harvested willow.",
        price: "95",
        category: "Basketry",
        imageUrl: "https://images.unsplash.com/photo-1604541309958-c8063f56d2a2"
      }
    ]);

    // Create discussions
    const [discussion1] = await db.insert(discussions).values({
      userId: john.id,
      title: "Best wood for beginner carving projects?",
      content: "I'm just getting started with wood carving and wondering what types of wood are best for beginners. Any suggestions from experienced carvers?",
      category: "Woodworking",
      views: 0,
      createdAt: new Date()
    }).returning();

    const [discussion2] = await db.insert(discussions).values({
      userId: maria.id,
      title: "Traditional indigo dyeing process",
      content: "I'm trying to recreate an authentic indigo dyeing process and struggling with getting consistent results. Has anyone here mastered this technique?",
      category: "Textile Arts",
      views: 0,
      createdAt: new Date()
    }).returning();

    const [discussion3] = await db.insert(discussions).values({
      userId: robert.id,
      title: "Finding authentic clay for traditional pottery",
      content: "Does anyone know good sources for traditional clay that would be similar to what was used historically? I'm trying to recreate authentic techniques.",
      category: "Ceramics",
      views: 0,
      createdAt: new Date()
    }).returning();

    // Create replies
    await db.insert(replies).values([
      {
        discussionId: discussion1.id,
        userId: robert.id,
        content: "Basswood is excellent for beginners. It's soft enough to carve easily but has enough integrity to hold detail.",
        createdAt: new Date()
      },
      {
        discussionId: discussion1.id,
        userId: maria.id,
        content: "I always recommend starting with lime wood or pine. They're forgiving but still give you a good feel for the process.",
        createdAt: new Date()
      }
    ]);

    // Create showcases
    await db.insert(showcases).values([
      {
        userId: john.id,
        title: "My first hand-carved wooden spoon",
        description: "After 3 weeks of practice, I finally completed my first spoon using traditional carving techniques!",
        imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261",
        likes: 0,
        createdAt: new Date()
      },
      {
        userId: maria.id,
        title: "Traditional Windsor chair completed!",
        description: "Six months of learning from John Carpenter's course and I've finished my first authentic Windsor chair.",
        imageUrl: "https://images.unsplash.com/photo-1574359411659-11a1e4c57220",
        likes: 0,
        createdAt: new Date()
      },
      {
        userId: robert.id,
        title: "First attempt at traditional weaving",
        description: "Learning to use a traditional loom has been challenging but rewarding. Here's my first completed textile!",
        imageUrl: "https://images.unsplash.com/photo-1475274226786-e636f48a5645",
        likes: 0,
        createdAt: new Date()
      },
      {
        userId: john.id,
        title: "Hand-bound leather journal",
        description: "Following Maria's leatherworking course, I created this journal using traditional binding techniques.",
        imageUrl: "https://images.unsplash.com/photo-1551614336-06746a69c6c6",
        likes: 0,
        createdAt: new Date()
      }
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}