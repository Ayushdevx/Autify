import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { Playlist, Song } from "@/lib/types";
import Image from "next/image";

interface AddToPlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  song: Song;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, song: Song) => void;
  onCreateNewPlaylist: () => void;
}

export function AddToPlaylistDialog({
  open,
  onOpenChange,
  song,
  playlists,
  onAddToPlaylist,
  onCreateNewPlaylist,
}: AddToPlaylistDialogProps) {
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);

  const handleAddToPlaylist = (playlistId: string) => {
    onAddToPlaylist(playlistId, song);
    setRecentlyAdded((prev) => [...prev, playlistId]);
    setTimeout(() => {
      setRecentlyAdded((prev) => prev.filter(id => id !== playlistId));
    }, 2000);
    toast.success(`Added to playlist`);
  };

  const thumbnailUrl = song?.thumbnail || "/default-song-cover.jpg";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-md overflow-hidden relative">
              <Image 
                src={thumbnailUrl}
                alt={song?.title || "Song thumbnail"}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <p className="font-medium">{song?.title}</p>
              <p className="text-sm text-muted-foreground">{song?.artist}</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onCreateNewPlaylist}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Playlist
          </Button>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {playlists.map((playlist) => {
                const isAdded = recentlyAdded.includes(playlist.id);
                const alreadyInPlaylist = playlist.songs.some(s => s.id === song?.id);

                return (
                  <Button
                    key={playlist.id}
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    disabled={alreadyInPlaylist}
                  >
                    <span>{playlist.name}</span>
                    {(isAdded || alreadyInPlaylist) && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}