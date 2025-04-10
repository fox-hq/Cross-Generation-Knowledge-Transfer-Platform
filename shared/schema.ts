import { pgTable, text, serial, integer, numeric, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  profileImage: text("profile_image"),
  bio: text("bio"),
  role: text("role").default("learner").notNull(),
  expertise: text("expertise"),
  yearsOfExperience: integer("years_of_experience"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
});

// Course schema
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: numeric("price").notNull(),
  imageUrl: text("image_url").notNull(),
  instructorId: integer("instructor_id").notNull(),
  duration: text("duration").notNull(),
  lessonCount: integer("lesson_count").notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  category: true,
  price: true,
  imageUrl: true,
  instructorId: true,
  duration: true,
  lessonCount: true,
});

// Mentorship schema
export const mentorships = pgTable("mentorships", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  duration: text("duration").notNull(),
  imageUrl: text("image_url"),
});

export const insertMentorshipSchema = createInsertSchema(mentorships).pick({
  mentorId: true,
  title: true,
  description: true,
  price: true,
  duration: true,
  imageUrl: true,
});

// Transcription schema
export const transcriptions = pgTable("transcriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  originalContent: text("original_content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTranscriptionSchema = createInsertSchema(transcriptions).pick({
  userId: true,
  title: true,
  content: true,
  originalContent: true,
});

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  sellerId: true,
  title: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
});

// Discussion/Forum schema
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  views: integer("views").default(0).notNull(),
});

export const insertDiscussionSchema = createInsertSchema(discussions).pick({
  userId: true,
  title: true,
  content: true,
  category: true,
});

// Discussion reply schema
export const replies = pgTable("replies", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReplySchema = createInsertSchema(replies).pick({
  discussionId: true,
  userId: true,
  content: true,
});

// Showcase schema
export const showcases = pgTable("showcases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertShowcaseSchema = createInsertSchema(showcases).pick({
  userId: true,
  title: true,
  description: true,
  imageUrl: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  mentorships: many(mentorships),
  transcriptions: many(transcriptions),
  products: many(products),
  discussions: many(discussions),
  replies: many(replies),
  showcases: many(showcases),
}));

export const coursesRelations = relations(courses, ({ one }) => ({
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
  }),
}));

export const mentorshipsRelations = relations(mentorships, ({ one }) => ({
  mentor: one(users, {
    fields: [mentorships.mentorId],
    references: [users.id],
  }),
}));

export const transcriptionsRelations = relations(transcriptions, ({ one }) => ({
  user: one(users, {
    fields: [transcriptions.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
}));

export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  user: one(users, {
    fields: [discussions.userId],
    references: [users.id],
  }),
  replies: many(replies),
}));

export const repliesRelations = relations(replies, ({ one }) => ({
  discussion: one(discussions, {
    fields: [replies.discussionId],
    references: [discussions.id],
  }),
  user: one(users, {
    fields: [replies.userId],
    references: [users.id],
  }),
}));

export const showcasesRelations = relations(showcases, ({ one }) => ({
  user: one(users, {
    fields: [showcases.userId],
    references: [users.id],
  }),
}));

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertMentorship = z.infer<typeof insertMentorshipSchema>;
export type Mentorship = typeof mentorships.$inferSelect;

export type InsertTranscription = z.infer<typeof insertTranscriptionSchema>;
export type Transcription = typeof transcriptions.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Discussion = typeof discussions.$inferSelect;

export type InsertReply = z.infer<typeof insertReplySchema>;
export type Reply = typeof replies.$inferSelect;

export type InsertShowcase = z.infer<typeof insertShowcaseSchema>;
export type Showcase = typeof showcases.$inferSelect;
