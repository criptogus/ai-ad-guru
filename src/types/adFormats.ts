
export type AdFormat = 'square' | 'portrait' | 'landscape' | 'feed' | 'reel';
export type GenerationFormat = 'square' | 'story' | 'horizontal' | 'portrait' | 'landscape';

export const formatMapping: Record<AdFormat, GenerationFormat> = {
  square: 'square',
  portrait: 'story',
  landscape: 'horizontal',
  feed: 'horizontal',
  reel: 'story'
};
