"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config"; // El @ apunta a la raíz de tu proyecto

export default function StudioPage() {
  return (
    <div className="h-screen w-full">
      <NextStudio config={config} />
    </div>
  );
}
