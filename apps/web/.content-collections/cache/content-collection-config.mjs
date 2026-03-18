// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
var speakers = defineCollection({
  directory: "content/speakers",
  include: "**/*.md",
  name: "speakers",
  schema: z.object({
    awards: z.array(z.string()).optional(),
    content: z.string(),
    headshot: z.string(),
    location: z.string(),
    name: z.string(),
    restaurant: z.string(),
    specialty: z.string(),
    title: z.string(),
  }),
  transform: (doc) => ({
    ...doc,
    slug: doc.name
      .toLowerCase()
      .replaceAll(/[^\w-]+/g, "-")
      .replaceAll(/-+/g, "-")
      .replaceAll(/^-|-$/g, ""),
  }),
});
var talks = defineCollection({
  directory: "content/talks",
  include: "**/*.md",
  name: "talks",
  schema: z.object({
    content: z.string(),
    duration: z.string(),
    image: z.string(),
    speaker: z.string(),
    title: z.string(),
    topics: z.array(z.string()),
  }),
  transform: (doc) => ({
    ...doc,
    slug: doc.title
      .toLowerCase()
      .replaceAll(/[^\w-]+/g, "-")
      .replaceAll(/-+/g, "-")
      .replaceAll(/^-|-$/g, ""),
  }),
});
var content_collections_default = defineConfig({
  collections: [speakers, talks],
});
export { content_collections_default as default };
