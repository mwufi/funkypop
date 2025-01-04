import { z } from "zod";
import { SubtitleData } from "./subtitles";

export const COMP_NAME = "MyComp";

export const CompositionProps = z.object({
  title: z.string(),
  subtitles: z.custom<SubtitleData>().optional(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Welcome to Funkypop",
  subtitles: {
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
  },
};

export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;
export const DURATION_IN_FRAMES = 150;
