import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFile = mutation({
  args: {
    fileName: v.string(),
    teamId: v.string(),
    createdBy: v.string(),
    archive: v.boolean(),
    document: v.string(),
    whiteboard: v.string(),
    public_url: v.string(),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db.insert("files", args);
    return file;
  },
});

export const getFiles = query({
  args: {
    teamId: v.string(),
  },
  handler: async (ctx, arg) => {
    const result = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("teamId"), arg.teamId))
      .collect();
    return result;
  },
});

export const updateDocument = mutation({
  args: {
    _id: v.id("files"),
    document: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args._id, { document: args.document });
    return result;
  },
});

export const updateWhiteBoard = mutation({
  args: {
    _id: v.id("files"),
    whiteboard: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args._id, {
      whiteboard: args.whiteboard,
    });
    return result;
  },
});

export const getFileById = query({
  args: {
    _id: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("files")
      .filter((q) =>
        q.and(
          q.eq(q.field("_id"), args._id),
          q.eq(q.field("createdBy"), args.createdBy)
        )
      )
      .first();
    return result;
  },
});

export const getPublicFileById = query({
  args: {
    _id: v.string(),
    public_url: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("files")
      .filter((q) =>
        q.and(
          q.eq(q.field("_id"), args._id),
          q.eq(q.field("public_url"), args.public_url)
        )
      )
      .first();
    return result;
  },
});

export const createPublicFile = mutation({
  args: {
    _id: v.id("files"),
    public_url: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args._id, {
      public_url: args.public_url,
    });
    return result;
  },
});
