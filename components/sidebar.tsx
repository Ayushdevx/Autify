"use client";

import { useState } from "react";
import { Home, Search, Library, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { usePlayerStore } from "@/lib/store";

export function Sidebar() {
  const [playlists, setPlaylists] = useState([
    { id: 1, name: "Liked Songs", icon: <Heart className="h-4 w-4" /> },
    { id: 2, name: "Your Top Songs 2024" },
    { id: 3, name: "Discover Weekly" },
  ]);

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
            <Button variant="ghost" className="w-full justify-start playlist-hover-effect" size="lg">
              <Home className="mr-2 h-5 w-5" />
              Home
            </Button>
          </motion.div>
          <motion.div variants={item}>
            <Button variant="ghost" className="w-full justify-start playlist-hover-effect" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </motion.div>
          <motion.div variants={item}>
            <Button variant="ghost" className="w-full justify-start playlist-hover-effect" size="lg">
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
          <Button variant="outline" className="w-full justify-start playlist-hover-effect" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Playlist
          </Button>
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
                className="w-full justify-start text-sm playlist-hover-effect p-2"
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