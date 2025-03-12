"use client";

import { useParams } from "next/navigation";
import { usePlayerStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Play, Pause, MoreVertical } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Song } from "@/lib/types";

export default function PlaylistPage() {
  const params = useParams();
  const { 
    likedSongs, 
    playlists,
    currentSong,
    isPlaying,
    setCurrentSong,
    setIsPlaying
  } = usePlayerStore();

  const handlePlay = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  // Handle liked songs playlist
  if (params.id === "liked") {
    return (
      <div className="p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative w-48 h-48 rounded-lg overflow-hidden">
            <Image
              src="/liked-songs-cover.jpg"
              alt="Liked Songs"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 opacity-60" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Liked Songs</h1>
            <p className="text-muted-foreground">
              {likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {likedSongs.map((song) => (
            <SongRow key={song.id} song={song} onPlay={handlePlay} currentSong={currentSong} isPlaying={isPlaying} />
          ))}
        </div>
      </div>
    );
  }

  // Handle regular playlists
  const playlist = playlists.find(p => p.id === params.id);
  
  if (!playlist) {
    return <div className="p-6">Playlist not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-48 h-48 rounded-lg overflow-hidden">
          <Image
            src={playlist.coverImage || "/default-playlist-cover.jpg"}
            alt={playlist.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-muted-foreground">
            {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
          </p>
          {playlist.description && (
            <p className="text-sm text-muted-foreground mt-2">{playlist.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {playlist.songs.map((song) => (
          <SongRow key={song.id} song={song} onPlay={handlePlay} currentSong={currentSong} isPlaying={isPlaying} />
        ))}
      </div>
    </div>
  );
}

interface SongRowProps {
  song: Song;
  onPlay: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

function SongRow({ song, onPlay, currentSong, isPlaying }: SongRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-4 p-2 rounded-lg hover:bg-card group"
    >
      <div className="w-12 h-12 relative rounded overflow-hidden">
        <Image
          src={song.thumbnail}
          alt={song.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="font-medium">{song.title}</p>
        <p className="text-sm text-muted-foreground">{song.artist}</p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onPlay(song)}
        >
          {currentSong?.id === song.id && isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}