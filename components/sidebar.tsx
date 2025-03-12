"use client";

import { useState } from "react";
import { Home, Search, Library, Plus, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Playlist {
  id: string; // Changed from number to string
  name: string;
  icon?: React.ReactNode;
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: "liked", name: "Liked Songs", icon: <Heart className="h-4 w-4" /> },
    { id: "top-2024", name: "Your Top Songs 2024" },
    { id: "discover", name: "Discover Weekly" },
  ]);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    setIsCreatingPlaylist(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPlaylist: Playlist = {
        id: Date.now().toString(), // Generate string ID
        name: newPlaylistName.trim(),
      };
      
      setPlaylists(prev => [...prev, newPlaylist]);
      setNewPlaylistName("");
      setIsDialogOpen(false);
      toast.success("Playlist created successfully");
    } catch (error) {
      toast.error("Failed to create playlist");
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handlePlaylistClick = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-primary mb-8"
        >
          AUtify
        </motion.h1>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <motion.div variants={item}>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start playlist-hover-effect",
                pathname === "/" && "bg-accent"
              )} 
              size="lg"
              onClick={() => handleNavigation("/")}
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </Button>
          </motion.div>
          <motion.div variants={item}>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start playlist-hover-effect",
                pathname === "/search" && "bg-accent"
              )} 
              size="lg"
              onClick={() => handleNavigation("/search")}
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </motion.div>
          <motion.div variants={item}>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start playlist-hover-effect",
                pathname === "/library" && "bg-accent"
              )} 
              size="lg"
              onClick={() => handleNavigation("/library")}
            >
              <Library className="mr-2 h-5 w-5" />
              Your Library
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 pt-8 border-t border-border"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start playlist-hover-effect" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
                />
                <Button 
                  className="w-full" 
                  onClick={handleCreatePlaylist}
                  disabled={isCreatingPlaylist}
                >
                  {isCreatingPlaylist && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      <ScrollArea className="flex-1 px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show" 
          className="space-y-2"
        >
          <p className="text-sm text-muted-foreground mb-4">Your Playlists</p>
          {playlists.map((playlist) => (
            <motion.div
              key={playlist.id}
              variants={item}
              className="group"
            >
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-sm playlist-hover-effect p-2",
                  pathname === `/playlist/${playlist.id}` && "bg-accent"
                )}
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                {playlist.icon}
                <span className="ml-2">{playlist.name}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}