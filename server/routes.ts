import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { transcribeContent, generateStructuredContent } from "./openai";
import Stripe from "stripe";
import multer from "multer";
import { z } from "zod";
import { insertDiscussionSchema, insertReplySchema, insertTranscriptionSchema } from "@shared/schema";

// Configure Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY, payment functionality will be limited');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Courses API
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(Number(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mentorships API
  app.get("/api/mentorships", async (req, res) => {
    try {
      const mentorships = await storage.getMentorships();
      res.json(mentorships);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/mentorships/:id", async (req, res) => {
    try {
      const mentorship = await storage.getMentorship(Number(req.params.id));
      if (!mentorship) {
        return res.status(404).json({ message: "Mentorship not found" });
      }
      res.json(mentorship);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Discussions API
  app.get("/api/discussions", async (req, res) => {
    try {
      const discussions = await storage.getDiscussions();
      res.json(discussions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/discussions/:id", async (req, res) => {
    try {
      const discussion = await storage.getDiscussion(Number(req.params.id));
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }
      await storage.incrementDiscussionViews(discussion.id);
      res.json(discussion);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/discussions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to create a discussion" });
    }

    try {
      const validatedData = insertDiscussionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const discussion = await storage.createDiscussion(validatedData);
      res.status(201).json(discussion);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid discussion data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Replies API
  app.get("/api/discussions/:id/replies", async (req, res) => {
    try {
      const replies = await storage.getRepliesByDiscussion(Number(req.params.id));
      res.json(replies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/discussions/:id/replies", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to post a reply" });
    }

    try {
      const validatedData = insertReplySchema.parse({
        ...req.body,
        discussionId: Number(req.params.id),
        userId: req.user.id
      });
      
      const reply = await storage.createReply(validatedData);
      res.status(201).json(reply);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reply data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Showcases API
  app.get("/api/showcases", async (req, res) => {
    try {
      const showcases = await storage.getShowcases();
      res.json(showcases);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/showcases/:id/like", async (req, res) => {
    try {
      await storage.incrementShowcaseLikes(Number(req.params.id));
      const showcase = await storage.getShowcase(Number(req.params.id));
      res.json(showcase);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Transcription API
  app.post("/api/transcribe", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to use the transcription service" });
    }

    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "No content provided for transcription" });
      }
      
      const transcribedContent = await transcribeContent(content);
      const structuredContent = await generateStructuredContent(transcribedContent);
      
      const validatedData = insertTranscriptionSchema.parse({
        userId: req.user.id,
        title: structuredContent.title,
        content: JSON.stringify(structuredContent),
        originalContent: content
      });
      
      const transcription = await storage.createTranscription(validatedData);
      res.status(201).json({
        transcription,
        structuredContent
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/transcriptions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view transcriptions" });
    }

    try {
      const transcriptions = await storage.getTranscriptions(req.user.id);
      res.json(transcriptions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment API
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }
      
      const { amount } = req.body;
      
      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  const httpServer = createServer(app);

  // Initialize router
  const router = express.Router();

  // Add AI chat endpoint
  router.post('/api/ai/chat', async (req, res) => {
    try {
      const { prompt } = req.body;
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://your-replit-app.repl.co',
          'X-Title': 'Knowledge AI'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Get video suggestions
      const videoQuery = `Give me 3 short but specific keyword phrases (comma separated) I can use to search for YouTube videos related to this content: ${aiResponse}`;
      const keywordsResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://your-replit-app.repl.co',
          'X-Title': 'Knowledge AI'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          messages: [{ role: 'user', content: videoQuery }],
          max_tokens: 20
        })
      });

      const keywordsData = await keywordsResponse.json();
      const keywords = keywordsData.choices[0].message.content.split(',').map((kw: string) => kw.trim());

      // Get YouTube videos
      const videos = [];
      for (const keyword of keywords) {
        const ytResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(keyword)}&key=${process.env.YOUTUBE_API_KEY}`
        );
        const ytData = await ytResponse.json();
        if (ytData.items?.[0]?.id?.videoId) {
          videos.push(ytData.items[0].id.videoId);
        }
      }

      res.json({ response: aiResponse, videos: videos.slice(0, 3) });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });

  // Use the router
  app.use(router);

  return httpServer;
}
