"use client";

import { useState } from "react";
import { Plus, MoreVertical, Play, Trash } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Playlist } from "@/lib/types";

export function PlaylistManager() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");

  const {
    playlists,
    currentPlaylist,
    setCurrentPlaylist,
    addPlaylist,
    removePlaylist,
    currentSong,
    setCurrentSong,
  } = useStore();

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const now = new Date();
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: newPlaylistName,
        description: newPlaylistDescription,
        songs: [],
        createdAt: now,
        updatedAt: now
      };
      
      addPlaylist(newPlaylist);
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setIsCreateOpen(false);
    }
  };

  const handleDeletePlaylist = (playlistId: string) => {
    removePlaylist(playlistId);
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Playlists</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Playlist Name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
              />
              <Button onClick={handleCreatePlaylist}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={`flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors ${
              currentPlaylist?.id === playlist.id ? "bg-accent" : ""
            }`}
          >
            <div
              className="flex-1 cursor-pointer"
              onClick={() => setCurrentPlaylist(playlist)}
            >
              <h3 className="font-medium">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground">
                {playlist.songs.length} songs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCurrentPlaylist(playlist);
                  if (playlist.songs.length > 0) {
                    setCurrentSong(playlist.songs[0]);
                  }
                }}
              >
                <Play className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDeletePlaylist(playlist.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}