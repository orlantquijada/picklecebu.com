import { toolDefinition } from "@tanstack/ai";
import { allSpeakers, allTalks } from "content-collections";
import { z } from "zod";

// Tool definition for getting a speaker by slug
export const getSpeakerBySlugToolDef = toolDefinition({
  description:
    "Get the full profile and bio of a specific speaker. Use this when asked about a particular speaker.",
  inputSchema: z.object({
    slug: z.string().describe("The slug of the speaker"),
  }),
  name: "getSpeakerBySlug",
  outputSchema: z.object({
    awards: z.array(z.string()),
    bio: z.string(),
    location: z.string(),
    name: z.string(),
    restaurant: z.string(),
    specialty: z.string(),
    title: z.string(),
  }),
});

// Server implementation
export const getSpeakerBySlug = getSpeakerBySlugToolDef.server(({ slug }) => {
  const speaker = allSpeakers.find((s) => s.slug === slug);
  if (!speaker) {
    return {
      awards: [],
      bio: "The requested speaker was not found.",
      location: "",
      name: "Speaker not found",
      restaurant: "",
      specialty: "",
      title: "",
    };
  }
  return {
    awards: speaker.awards || [],
    bio: speaker.content,
    location: speaker.location,
    name: speaker.name,
    restaurant: speaker.restaurant,
    specialty: speaker.specialty,
    title: speaker.title,
  };
});

// Tool definition for getting a talk by slug
export const getTalkBySlugToolDef = toolDefinition({
  description:
    "Get the full details of a specific session/talk. Use this when asked about a particular session.",
  inputSchema: z.object({
    slug: z.string().describe("The slug of the talk"),
  }),
  name: "getTalkBySlug",
  outputSchema: z.object({
    description: z.string(),
    duration: z.string(),
    speaker: z.string(),
    title: z.string(),
    topics: z.array(z.string()),
  }),
});

// Server implementation
export const getTalkBySlug = getTalkBySlugToolDef.server(({ slug }) => {
  const talk = allTalks.find((t) => t.slug === slug);
  if (!talk) {
    return {
      description: "The requested session was not found.",
      duration: "",
      speaker: "",
      title: "Session not found",
      topics: [],
    };
  }
  return {
    description: talk.content,
    duration: talk.duration,
    speaker: talk.speaker,
    title: talk.title,
    topics: talk.topics,
  };
});

// Tool definition for listing all speakers
export const getAllSpeakersToolDef = toolDefinition({
  description:
    "Get a list of all speakers at the conference with their names, specialties, and restaurants.",
  inputSchema: z.object({}),
  name: "getAllSpeakers",
  outputSchema: z.array(
    z.object({
      location: z.string(),
      name: z.string(),
      restaurant: z.string(),
      slug: z.string(),
      specialty: z.string(),
    })
  ),
});

// Server implementation
export const getAllSpeakers = getAllSpeakersToolDef.server(() =>
  allSpeakers.map((speaker) => ({
    location: speaker.location,
    name: speaker.name,
    restaurant: speaker.restaurant,
    slug: speaker.slug,
    specialty: speaker.specialty,
  }))
);

// Tool definition for listing all talks
export const getAllTalksToolDef = toolDefinition({
  description:
    "Get a list of all sessions/talks at the conference with their titles, speakers, and topics.",
  inputSchema: z.object({}),
  name: "getAllTalks",
  outputSchema: z.array(
    z.object({
      duration: z.string(),
      slug: z.string(),
      speaker: z.string(),
      title: z.string(),
      topics: z.array(z.string()),
    })
  ),
});

// Server implementation
export const getAllTalks = getAllTalksToolDef.server(() =>
  allTalks.map((talk) => ({
    duration: talk.duration,
    slug: talk.slug,
    speaker: talk.speaker,
    title: talk.title,
    topics: talk.topics,
  }))
);

// Tool definition for searching conference content
export const searchConferenceToolDef = toolDefinition({
  description:
    "Search for speakers or sessions by keyword. Use this to find content matching user queries about topics, techniques, or names.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
  }),
  name: "searchConference",
  outputSchema: z.object({
    speakers: z.array(
      z.object({
        name: z.string(),
        restaurant: z.string(),
        slug: z.string(),
        specialty: z.string(),
      })
    ),
    talks: z.array(
      z.object({
        slug: z.string(),
        speaker: z.string(),
        title: z.string(),
        topics: z.array(z.string()),
      })
    ),
  }),
});

// Server implementation
export const searchConference = searchConferenceToolDef.server(({ query }) => {
  const queryLower = query.toLowerCase();

  const matchingSpeakers = allSpeakers
    .filter(
      (speaker) =>
        speaker.name.toLowerCase().includes(queryLower) ||
        speaker.specialty.toLowerCase().includes(queryLower) ||
        speaker.restaurant.toLowerCase().includes(queryLower) ||
        speaker.content.toLowerCase().includes(queryLower)
    )
    .map((speaker) => ({
      name: speaker.name,
      restaurant: speaker.restaurant,
      slug: speaker.slug,
      specialty: speaker.specialty,
    }));

  const matchingTalks = allTalks
    .filter(
      (talk) =>
        talk.title.toLowerCase().includes(queryLower) ||
        talk.speaker.toLowerCase().includes(queryLower) ||
        talk.topics.some((topic) => topic.toLowerCase().includes(queryLower)) ||
        talk.content.toLowerCase().includes(queryLower)
    )
    .map((talk) => ({
      slug: talk.slug,
      speaker: talk.speaker,
      title: talk.title,
      topics: talk.topics,
    }));

  return {
    speakers: matchingSpeakers,
    talks: matchingTalks,
  };
});
