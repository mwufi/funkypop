import { z } from "zod";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CompositionProps } from "@/types/constants";
import React from "react";
import { SubtitleRenderer } from "./subtitles/SubtitleRenderer";
import { SubtitleData } from "@/types/subtitles";

// Sample subtitle data
const sampleSubtitles: SubtitleData = {
  phrases: [
    {
      text: "Welcome to Funkypop",
      startFrame: 0,
      endFrame: 30,
      style: "tiktok-black",
      x: 50,
      y: 50,
    },
    {
      text: "Create amazing videos",
      startFrame: 31,
      endFrame: 60,
      style: "tiktok-white-border",
      x: 50,
      y: 50,
    },
    {
      text: "WITH STYLE",
      startFrame: 61,
      endFrame: 90,
      style: "uppercase",
      x: 50,
      y: 50,
    },
  ],
};

export const Main = ({ title, subtitles = sampleSubtitles }: z.infer<typeof CompositionProps>) => {
  return (
    <AbsoluteFill className="bg-gray-900">
      {subtitles.phrases.map((phrase, index) => (
        <SubtitleRenderer key={index} phrase={phrase} />
      ))}
    </AbsoluteFill>
  );
};
