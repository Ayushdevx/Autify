export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  duration: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  songs: Song[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    audioQuality: 'auto' | 'high' | 'medium' | 'low';
    crossfade: boolean;
    crossfadeDuration: number;
  };
}