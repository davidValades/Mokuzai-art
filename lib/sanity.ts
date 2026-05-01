// lib/sanity.ts
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "4mu6sf1j",
  dataset: "production",
  apiVersion: "2024-05-01",
  useCdn: true,
});
