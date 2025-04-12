import type { Express } from "express";
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

  return httpServer;
}
import { Router } from 'express';
import { getYoutubeVideos, generateAIResponse } from './openai';

// Add this to your existing routes
router.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await generateAIResponse(prompt);
    const videos = await getYoutubeVideos(response);
    res.json({ response, videos });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});
