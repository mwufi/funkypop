export interface MediaTrack {
  id: string;
  url: string;
  name: string;
  startFrame: number;
  endFrame: number;
  isPrimary?: boolean;
}

export interface MediaSegment {
  trackId: string;
  startFrame: number;
  endFrame: number;
}
