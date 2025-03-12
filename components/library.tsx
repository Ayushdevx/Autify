"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Search, Grid, List, Heart, Play, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { CreatePlaylistDialog } from "./create-playlist-dialog";
import { AddToPlaylistDialog } from "./add-to-playlist-dialog";
import { Song, Playlist } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LikedSongsPlaylist {
  id: string;
  name: string;
  songs: Song[];
  isLikedSongs: boolean;
}

type PlaylistItem = Playlist | LikedSongsPlaylist;

interface ItemProps {
  item: PlaylistItem;
  onPlay: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
}

export function Library() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const router = useRouter();
  
  const { 
    setCurrentSong, 
    setIsPlaying, 
    playlists,
    likedSongs,
    addSongToPlaylist
  } = useStore();

  const handlePlayClick = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleAddToPlaylistClick = (song: Song) => {
    setSelectedSong(song);
    setIsAddToPlaylistOpen(true);
  };

  const handleCreatePlaylist = async (name: string, description?: string) => {
    try {
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name,
        description,
        songs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (selectedSong) {
        addSongToPlaylist(newPlaylist.id, selectedSong);
        setIsAddToPlaylistOpen(false);
        toast.success(`Added to ${newPlaylist.name}`);
      }
      
      setIsCreatePlaylistOpen(false);
      toast.success("Playlist created successfully");
    } catch (error) {
      toast.error("Failed to create playlist");
    }
  };

  const handlePlaylistClick = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  const likedSongsPlaylist: LikedSongsPlaylist = {
    id: 'liked',
    name: 'Liked Songs',
    songs: likedSongs,
    isLikedSongs: true
  };

  const filteredItems: PlaylistItem[] = [
    likedSongsPlaylist,
    ...playlists
  ].filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search and view controls */}
      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Search playlists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView(view === "grid" ? "list" : "grid")}
        >
          {view === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
        </Button>
      </div>

      {/* Playlists grid/list */}
      <div className={view === "grid" ? "grid grid-cols-3 gap-4" : "space-y-2"}>
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {view === "grid" ? (
              <GridItem
                item={item}
                onPlay={handlePlayClick}
                onAddToPlaylist={handleAddToPlaylistClick}
              />
            ) : (
              <ListItem
                item={item}
                onPlay={handlePlayClick}
                onAddToPlaylist={handleAddToPlaylistClick}
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
        onAddToPlaylist={(playlistId, song) => {
          addSongToPlaylist(playlistId, song);
          setIsAddToPlaylistOpen(false);
          toast.success("Added to playlist");
        }}
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
  const coverImage = 'isLikedSongs' in item 
    ? "/liked-songs-cover.jpg"
    : item.coverImage || "/default-playlist.jpg";

  return (
    <div className="relative group p-4 rounded-lg bg-card hover:bg-card/80">
      <Image
        src={coverImage}
        alt={item.name}
        width={200}
        height={200}
        className="rounded-md"
      />
      <h3 className="mt-2 font-semibold">{item.name}</h3>
    </div>
  );
}

function ListItem({ item, onPlay, onAddToPlaylist }: ItemProps) {
  const coverImage = 'isLikedSongs' in item 
    ? "/liked-songs-cover.jpg"
    : item.coverImage || "/default-playlist.jpg";

  return (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-card/80">
      <Image
        src={coverImage}
        alt={item.name}
        width={48}
        height={48}
        className="rounded-md"
      />
      <h3 className="font-semibold">{item.name}</h3>
    </div>
  );
}