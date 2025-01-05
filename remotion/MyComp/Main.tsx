import { AbsoluteFill, Sequence, Video } from 'remotion';
import { CompositionProps } from "@/types/constants";
import React from "react";
import { SubtitleRenderer } from "./subtitles/SubtitleRenderer";
import { Timeline } from '@/types/media';
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

export const Main = ({ title, subtitles = sampleSubtitles, timeline }: z.infer<typeof CompositionProps> & { timeline: Timeline }) => {
  return (
    <AbsoluteFill className="bg-gray-900">
      {/* Render clips in sequence */}
      {timeline.clips.map((clip) => (
        <Sequence
          key={clip.id}
          from={clip.start}
          durationInFrames={clip.duration}
        >
          {clip.type === 'video' ? (
            <Video
              src={clip.url}
              startFrom={clip.sourceStart}
              endAt={clip.sourceEnd}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={clip.url}
              className="absolute inset-0 w-full h-full object-cover"
              alt={clip.name}
            />
          )}
        </Sequence>
      ))}

      {/* Subtitles */}
      {subtitles?.phrases?.map((phrase, index) => (
        <SubtitleRenderer key={index} phrase={phrase} />
      ))}
    </AbsoluteFill>
  );
};
