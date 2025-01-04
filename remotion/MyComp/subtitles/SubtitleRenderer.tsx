import React, { lazy, Suspense } from 'react';
import { useCurrentFrame } from 'remotion';
import { SubtitlePhrase, SubtitleStyle } from '@/types/subtitles';

// Create a map of style names to their component paths
const styleComponentMap: Record<SubtitleStyle, () => Promise<{ default: React.ComponentType<any> }>> = {
  'tiktok-black': () => import('./TextStyles').then(m => ({ default: m.TiktokBlack })),
  'tiktok-white-border': () => import('./TextStyles').then(m => ({ default: m.TiktokWhiteBorder })),
  'tiktok-white': () => import('./TextStyles').then(m => ({ default: m.TiktokWhite })),
  'shadow': () => import('./TextStyles').then(m => ({ default: m.Shadow })),
  'uppercase': () => import('./TextStyles').then(m => ({ default: m.Uppercase })),
  'laura': () => import('./TextStyles').then(m => ({ default: m.Laura })),
  'logan': () => import('./TextStyles').then(m => ({ default: m.Logan })),
  'enrico': () => import('./TextStyles').then(m => ({ default: m.Enrico })),
  'mike': () => import('./TextStyles').then(m => ({ default: m.Mike })),
  'devin': () => import('./TextStyles').then(m => ({ default: m.Devin })),
  'hormozi': () => import('./TextStyles').then(m => ({ default: m.Hormozi })),
  'masi': () => import('./TextStyles').then(m => ({ default: m.Masi })),
  'ali': () => import('./TextStyles').then(m => ({ default: m.Ali })),
};

// Create lazy components for each style
const TextComponents: Record<SubtitleStyle, React.LazyExoticComponent<React.ComponentType<any>>> = 
  Object.fromEntries(
    Object.entries(styleComponentMap).map(([key, importFn]) => [
      key,
      lazy(importFn)
    ])
  ) as Record<SubtitleStyle, React.LazyExoticComponent<React.ComponentType<any>>>;

interface SubtitleRendererProps {
  phrase: SubtitlePhrase;
}

export const SubtitleRenderer: React.FC<SubtitleRendererProps> = ({ phrase }) => {
  const frame = useCurrentFrame();
  const TextComponent = TextComponents[phrase.style];

  if (frame < phrase.startFrame || frame > phrase.endFrame) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TextComponent x={phrase.x} y={phrase.y} fontSize={phrase.fontSize}>
        {phrase.text}
      </TextComponent>
    </Suspense>
  );
};
