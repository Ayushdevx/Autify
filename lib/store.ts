import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Playlist, Song, UserProfile } from './types';

interface StoreState {
  // Player State
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  playlists: Playlist[];
  likedSongs: Song[];
  currentPlaylist: Playlist | null;

  // User State
  user: UserProfile | null;

  // Player Actions
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  addPlaylist: (playlist: Playlist) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removePlaylist: (playlistId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  addToLikedSongs: (song: Song) => void;
  removeFromLikedSongs: (songId: string) => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;

  // User Actions
  updateUserPreferences: (preferences: Partial<UserProfile['preferences']>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Player State
      currentSong: null,
      isPlaying: false,
      volume: 1,
      queue: [],
      playlists: [],
      likedSongs: [],
      currentPlaylist: null,

      // User State
      user: null,

      // Player Actions
      setCurrentSong: (song) => set({ currentSong: song }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
      removeFromQueue: (songId) => set((state) => ({
        queue: state.queue.filter((song) => song.id !== songId)
      })),
      clearQueue: () => set({ queue: [] }),
      addPlaylist: (playlist) => set((state) => ({
        playlists: [...state.playlists, playlist]
      })),
      addSongToPlaylist: (playlistId, song) => set((state) => ({
        playlists: state.playlists.map((playlist) =>
          playlist.id === playlistId
            ? { ...playlist, songs: [...playlist.songs, song] }
            : playlist
        )
      })),
      removePlaylist: (playlistId) => set((state) => ({
        playlists: state.playlists.filter((playlist) => playlist.id !== playlistId)
      })),
      removeSongFromPlaylist: (playlistId, songId) => set((state) => ({
        playlists: state.playlists.map((playlist) =>
          playlist.id === playlistId
            ? { ...playlist, songs: playlist.songs.filter((song) => song.id !== songId) }
            : playlist
        )
      })),
      addToLikedSongs: (song) => set((state) => ({
        likedSongs: state.likedSongs.some(s => s.id === song.id)
          ? state.likedSongs
          : [...state.likedSongs, song]
      })),
      removeFromLikedSongs: (songId) => set((state) => ({
        likedSongs: state.likedSongs.filter((song) => song.id !== songId)
      })),
      setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),

      // User Actions
      updateUserPreferences: (preferences) => set((state) => ({
        user: state.user ? {
          ...state.user,
          preferences: { ...state.user.preferences, ...preferences }
        } : null
      })),
    }),
    {
      name: 'app-storage',
    }
  )
);
