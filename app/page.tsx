"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import { Main } from "@/remotion/MyComp/Main";
import {
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "@/types/constants";
import { z } from "zod";
import { RenderControls } from "@/components/RenderControls";
import { Tips } from "@/components/Tips";
import { Spacing } from "@/components/Spacing";
import { AuthButton } from "@/components/AuthButton";
import { StyleSelector } from "@/components/StyleSelector";
import { SubtitleStyle } from "@/types/subtitles";

const Home: NextPage = () => {
  const [text, setText] = useState<string>(defaultMyCompProps.title);
  const [subtitles, setSubtitles] = useState(defaultMyCompProps.subtitles);
  const [selectedStyle, setSelectedStyle] = useState<SubtitleStyle>("tiktok-black");
  const [fontSize, setFontSize] = useState<number>(70);

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
      subtitles,
    };
  }, [text, subtitles]);

  const handleSubtitleInput = (value: string) => {
    // Split by newlines and create subtitle phrases
    const lines = value.split('\n').filter(line => line.trim());
    const phrases = lines.map((line, index) => ({
      text: line,
      startFrame: index * 30,
      endFrame: (index + 1) * 30 - 1,
      style: selectedStyle,
      fontSize,
      x: 50,
      y: 50,
    }));
    setSubtitles({ phrases, fontSize });
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Funkypop Video Maker</h1>
        <AuthButton />
      </div>
      <div className="max-w-screen-md m-auto mb-5">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Text Style
          </label>
          <StyleSelector
            selectedStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size: {fontSize}px
          </label>
          <input
            type="range"
            min="20"
            max="120"
            value={fontSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value);
              setFontSize(newSize);
              if (subtitles?.phrases) {
                handleSubtitleInput(subtitles.phrases.map(p => p.text).join('\n'));
              }
            }}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Subtitles
          </label>
          <textarea
            className="w-full h-32 p-2 border rounded"
            placeholder="Enter your subtitles (one line per phrase)"
            onChange={(e) => handleSubtitleInput(e.target.value)}
          />
        </div>
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
          <Player
            component={Main}
            inputProps={inputProps}
            durationInFrames={DURATION_IN_FRAMES}
            fps={VIDEO_FPS}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            style={{
              // Can't use tailwind class for width since player's default styles take presedence over tailwind's,
              // but not over inline styles
              width: "100%",
            }}
            controls
            autoPlay
            loop
          />
        </div>
        <RenderControls
          text={text}
          setText={setText}
          inputProps={inputProps}
        ></RenderControls>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Tips></Tips>
      </div>
    </div>
  );
};

export default Home;
