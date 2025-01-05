"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useCallback, useMemo, useEffect, useState } from "react";
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
import { SubtitleStyle } from "@/types/subtitles";
import { RenderControls } from "@/components/RenderControls";
import { Tips } from "@/components/Tips";
import { Spacing } from "@/components/Spacing";
import { AuthButton } from "@/components/AuthButton";
import { StyleSelector } from "@/components/StyleSelector";
import { VideoPreview } from "@/components/VideoPreview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MediaTrackEditor from '@/components/MediaTrackEditor';
import { MediaTrack } from '@/types/media';

const Home: NextPage = () => {
  const [text, setText] = useState<string>(defaultMyCompProps.title);
  const [subtitles, setSubtitles] = useState({ phrases: [], fontSize: 70 });
  const [selectedStyle, setSelectedStyle] = useState<SubtitleStyle>("tiktok-black");
  const [subtitleText, setSubtitleText] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(70);
  const [mediaTracks, setMediaTracks] = useState<MediaTrack[]>([
    {
      id: '1',
      url: 'https://ynxmunrlesicnfibjctb.supabase.co/storage/v1/object/public/project-images/funkypop-public/forest.mp4',
      name: 'Forest',
      startFrame: 0,
      endFrame: 90,
      isPrimary: true
    },
    {
      id: '2',
      url: 'https://ynxmunrlesicnfibjctb.supabase.co/storage/v1/object/public/project-images/funkypop-public/house.mp4',
      name: 'House',
      startFrame: 91,
      endFrame: 180
    }
  ]);

  const inputProps = useMemo(() => {
    return {
      title: text,
      subtitles,
      mediaTracks,
    };
  }, [text, subtitles, mediaTracks]);

  const handleSubtitleInput = useCallback((value: string) => {
    setSubtitleText(value);
    // Split by newlines and create subtitle phrases
    const lines = value.split('\n').filter(line => line.trim());
    const wordsPerSecond = 3.7;
    const framesPerSecond = 30;
    const minDuration = framesPerSecond;

    let currentFrame = 0;
    const phrases = lines.map((line) => {
      const wordCount = line.split(/[^\p{L}\p{N}]+/u).filter(Boolean).length;
      const duration = Math.max(minDuration, Math.ceil(wordCount / wordsPerSecond * framesPerSecond));
      const phrase = {
        text: line,
        startFrame: currentFrame,
        endFrame: currentFrame + duration - 1,
        style: selectedStyle,
        fontSize,
        x: 50,
        y: 50,
      };
      currentFrame += duration;
      return phrase;
    });
    setSubtitles({ phrases, fontSize });
  }, [selectedStyle, fontSize]);

  const handleTrackUpdate = (updatedTrack: MediaTrack) => {
    setMediaTracks(tracks =>
      tracks.map(track => (track.id === updatedTrack.id ? updatedTrack : track))
    );
  };

  const handlePrimaryChange = (trackId: string) => {
    setMediaTracks(tracks =>
      tracks.map(track => ({
        ...track,
        isPrimary: track.id === trackId
      }))
    );
  };

  // Update subtitles when style or font size changes
  useEffect(() => {
    if (subtitleText) {
      handleSubtitleInput(subtitleText);
    } else if (subtitles.phrases.length > 0) {
      // If there's no subtitle text but there are existing phrases,
      // update all phrases with the new style
      setSubtitles(prev => ({
        ...prev,
        phrases: prev.phrases.map(phrase => ({
          ...phrase,
          style: selectedStyle,
          fontSize,
        })),
      }));
    }
  }, [selectedStyle, fontSize, handleSubtitleInput, subtitleText]);

  const subtitleTimeMax = subtitles.phrases.reduce((max, phrase) => Math.max(max, phrase.endFrame), 0) || 0;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-50 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Funkypop Video Maker</h1>
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-6rem)]">
            {/* Video Preview */}
            <div className="lg:col-span-8 h-full">
              <div className="space-y-4">
                <VideoPreview
                  component={Main}
                  durationInFrames={600} // This will be overridden by the actual video duration
                  fps={30}
                  inputProps={inputProps}
                  height={VIDEO_HEIGHT}
                  width={VIDEO_WIDTH}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="lg:col-span-4 overflow-y-auto h-full">
              <Accordion type="single" collapsible className="w-full">
                {/* Subtitle Editor */}
                <AccordionItem value="subtitles">
                  <AccordionTrigger className="text-lg font-semibold">
                    Edit Subtitles
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter Subtitles
                        </label>
                        <textarea
                          className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your subtitles (one line per phrase)"
                          value={subtitleText}
                          onChange={(e) => handleSubtitleInput(e.target.value)}
                        />
                      </div>
                      <div>
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
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Style Selector */}
                <AccordionItem value="styles">
                  <AccordionTrigger className="text-lg font-semibold">
                    Choose Style
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4">
                      <StyleSelector
                        selectedStyle={selectedStyle}
                        onStyleSelect={setSelectedStyle}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
