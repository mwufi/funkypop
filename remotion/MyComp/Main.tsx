import { z } from "zod";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CompositionProps } from "@/types/constants";
import { NextLogo } from "./NextLogo";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import React from "react";
import { Rings } from "./Rings";
import { TextFade } from "./TextFade";

loadFont();

export const Main = ({ title }: z.infer<typeof CompositionProps>) => {
  const { fps } = useVideoConfig();

  const transitionStart = 1 * fps;

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  return (
    <AbsoluteFill className="bg-white">
      <Sequence from={transitionStart}>
        <TextFade>
          {title.split('').map((char, index) => (
            <span
              key={index}
              className="text-[70px] font-bold inline-block"
              style={{
                fontFamily,
                color: getRandomColor(),
                transition: 'color 0.5s ease',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </TextFade>
      </Sequence>
    </AbsoluteFill>
  );
};
