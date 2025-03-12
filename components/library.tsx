"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Grid, List, Heart, Play, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlayerStore } from "@/lib/store";
import Image from "next/image";
import { toast } from "sonner";
import { AddToPlaylistDialog } from "./add-to-playlist-dialog";
import { CreatePlaylistDialog } from "./create-playlist-dialog";
import { Song } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ItemProps {
  item: Playlist | { id: string; name: string; songs: Song[] };
  onPlay: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
}

export function Library() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const { 
    setCurrentSong, 
    setIsPlaying, 
    playlists, 
    addPlaylist, 
    addSongToPlaylist,
    likedSongs
  } = usePlayerStore();
  const router = useRouter();

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleAddToPlaylist = (playlistId: string, song: Song) => {
    addSongToPlaylist(playlistId, song);
    setIsAddToPlaylistOpen(false);
  };

  const handleCreatePlaylist = (name: string, description?: string) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description,
      songs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addPlaylist(newPlaylist);
    setIsCreatePlaylistOpen(false);
    
    if (selectedSong) {
      addSongToPlaylist(newPlaylist.id, selectedSong);
      setIsAddToPlaylistOpen(false);
      toast.success(`Added to ${newPlaylist.name}`);
    }
  };

  const handlePlaylistClick = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  const filteredItems = [
    { 
      id: 'liked', 
      name: 'Liked Songs', 
      songs: likedSongs, 
      isLikedSongs: true 
    },
    ...playlists
  ].filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search in Your Library"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
            leftIcon={<Search className="h-4 w-4" />}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {view === "grid" ? (
                  <Grid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setView("grid")}>
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("list")}>
                List View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={() => setIsCreatePlaylistOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Playlist
        </Button>
      </div>

      <div 
        className={
          view === "grid" 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" 
            : "space-y-2"
        }
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              view === "grid" 
                ? "group relative cursor-pointer" 
                : "flex items-center gap-4 p-2 rounded-lg hover:bg-card cursor-pointer"
            }
            onClick={() => handlePlaylistClick(item.id)}
          >
            {view === "grid" ? (
              <GridItem 
                item={item} 
                onPlay={handlePlaySong}
                onAddToPlaylist={(song) => {
                  setSelectedSong(song);
                  setIsAddToPlaylistOpen(true);
                }}
              />
            ) : (
              <ListItem 
                item={item} 
                onPlay={handlePlaySong}
                onAddToPlaylist={(song) => {
                  setSelectedSong(song);
                  setIsAddToPlaylistOpen(true);
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <AddToPlaylistDialog
        open={isAddToPlaylistOpen}
        onOpenChange={setIsAddToPlaylistOpen}
        song={selectedSong!}
        playlists={playlists}
        onAddToPlaylist={handleAddToPlaylist}
        onCreateNewPlaylist={() => {
          setIsAddToPlaylistOpen(false);
          setIsCreatePlaylistOpen(true);
        }}
      />

      <CreatePlaylistDialog
        open={isCreatePlaylistOpen}
        onOpenChange={setIsCreatePlaylistOpen}
        onSubmit={handleCreatePlaylist}
      />
    </div>
  );
}

function GridItem({ item, onPlay, onAddToPlaylist }: ItemProps) {
  const songCount = item.songs.length;
  
  return (
    <>
      <div className="aspect-square relative overflow-hidden rounded-lg">
        <Image
          src={item.isLikedSongs ? '/liked-songs-cover.jpg' : (item.coverImage || '/default-playlist-cover.jpg')}
          alt={item.name}
          fill
          className="object-cover"
        />
        {item.isLikedSongs && (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 opacity-60" />
        )}
        {songCount > 0 && (
          <Button
            size="icon"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onPlay(item.songs[0])}
          >
            <Play className="h-6 w-6" />
          </Button>
        )}
      </div>
      <h3 className="mt-2 font-medium truncate">{item.name}</h3>
      <p className="text-sm text-muted-foreground">
        {songCount} {songCount === 1 ? 'song' : 'songs'}
      </p>
    </>
  );
}

function ListItem({ item, onPlay, onAddToPlaylist }: ItemProps) {
  const songCount = item.songs.length;
  
  return (
    <>
      <div className="w-12 h-12 relative rounded overflow-hidden">
        <Image
          src={item.isLikedSongs ? '/liked-songs-cover.jpg' : (item.coverImage || '/default-playlist-cover.jpg')}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          {songCount} {songCount === 1 ? 'song' : 'songs'}
        </p>
      </div>
      {songCount > 0 && (
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => onPlay(item.songs[0])}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}