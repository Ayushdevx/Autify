import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Playlist, Song } from './types';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  playlists: Playlist[];
  addPlaylist: (playlist: Playlist) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removePlaylist: (playlistId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  likedSongs: Song[];
  addToLikedSongs: (song: Song) => void;
  removeFromLikedSongs: (songId: string) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentSong: null,
      isPlaying: false,
      queue: [],
      playlists: [],
      likedSongs: [],
      
      setCurrentSong: (song) => set({ currentSong: song }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      
      addToQueue: (song) => 
        set((state) => ({ 
          queue: [...state.queue, song] 
        })),
      
      removeFromQueue: (songId) =>
        set((state) => ({
          queue: state.queue.filter((song) => song.id !== songId)
        })),
      
      clearQueue: () => set({ queue: [] }),
      
      addPlaylist: (playlist) =>
        set((state) => ({
          playlists: [...state.playlists, playlist]
        })),
      
      addSongToPlaylist: (playlistId, song) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  songs: playlist.songs.some(s => s.id === song.id)
                    ? playlist.songs
                    : [...playlist.songs, song],
                  updatedAt: new Date()
                }
              : playlist
          )
        })),
      
      removePlaylist: (playlistId) =>
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== playlistId)
        })),
      
      removeSongFromPlaylist: (playlistId, songId) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  songs: playlist.songs.filter((song) => song.id !== songId),
                  updatedAt: new Date()
                }
              : playlist
          )
        })),
      
      addToLikedSongs: (song) =>
        set((state) => ({
          likedSongs: state.likedSongs.some(s => s.id === song.id)
            ? state.likedSongs
            : [...state.likedSongs, song]
        })),
      
      removeFromLikedSongs: (songId) =>
        set((state) => ({
          likedSongs: state.likedSongs.filter((song) => song.id !== songId)
        })),
    }),
    {
      name: 'player-storage',
    }
  )
);
