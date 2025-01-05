export interface Clip {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'image';
  // Source material timing (for trimming the clip)
  sourceStart: number;  // in frames
  sourceEnd: number;    // in frames
  // Timeline position
  start: number;        // in frames
  duration: number;     // in frames
}

export interface Timeline {
  clips: Clip[];
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'video' | 'image';
  startFrame?: number;
  endFrame?: number;
}

export interface PrimaryTrack {
  id: string;
  media: MediaItem;
}

export interface SecondaryTrack {
  id: string;
  clips: MediaItem[];
}

export interface MediaTracks {
  primary: PrimaryTrack | null;
  secondary: SecondaryTrack[];
}
