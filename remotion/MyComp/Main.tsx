import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Video } from 'remotion';
import { CompositionProps } from "@/types/constants";
import React from "react";
import { SubtitleRenderer } from "./subtitles/SubtitleRenderer";
import { SubtitleData } from "@/types/subtitles";
import { MediaTrack } from '@/types/media';
import { z } from "zod";

// Sample subtitle data
const sampleSubtitles: SubtitleData = [
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
];

export const Main = ({ title, subtitles = sampleSubtitles, mediaTracks }: z.infer<typeof CompositionProps> & { mediaTracks: MediaTrack[] }) => {
  const frame = useCurrentFrame();

  // Find the active track for the current frame
  const activeTrack = mediaTracks?.find(
    track => frame >= track.startFrame && frame <= track.endFrame
  ) || mediaTracks?.find(track => track.isPrimary);

  return (
    <AbsoluteFill className="bg-gray-900">
      {activeTrack && (
        <Video src={activeTrack.url} className="absolute inset-0 w-full h-full object-cover" />
      )}
      {subtitles.phrases.map((phrase, index) => (
        <SubtitleRenderer key={index} phrase={phrase} />
      ))}
    </AbsoluteFill>
  );
};
