export type SubtitleStyle = 
  | 'tiktok-black'
  | 'tiktok-white-border'
  | 'tiktok-white'
  | 'shadow'
  | 'uppercase'
  | 'laura'
  | 'logan'
  | 'enrico'
  | 'mike'
  | 'devin'
  | 'hormozi'
  | 'masi'
  | 'ali';

export interface SubtitlePhrase {
  text: string;
  startFrame: number;
  endFrame: number;
  style: SubtitleStyle;
  x?: number;
  y?: number;
  fontSize?: number;
}

export interface SubtitleData {
  phrases: SubtitlePhrase[];
  fontSize?: number; // Global font size for all phrases
}
