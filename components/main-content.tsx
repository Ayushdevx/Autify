"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Pause, Plus, Heart, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchYouTube } from "@/lib/youtube";
import { getRecommendations } from "@/lib/gemini";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import Image from 'next/image';
import { Song } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddToPlaylistDialog } from "./add-to-playlist-dialog";

interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

export function MainContent() {
  const { 
    currentSong, 
    isPlaying,
    setIsPlaying,
    setCurrentSong,
    addToQueue, 
    playlists, 
    addSongToPlaylist,
    likedSongs,
    addToLikedSongs,
    removeFromLikedSongs 
  } = useStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchYouTube(searchTerm);
      setSearchResults(results);
      
      const aiRecs = await getRecommendations(searchTerm);
      setRecommendations(aiRecs);
    } catch (error) {
      toast.error("Failed to search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const playSong = (song: any) => {
    const songData: Song = {
      id: song.id.videoId,
      title: song.snippet.title,
      artist: song.snippet.channelTitle,
      thumbnail: song.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${song.id.videoId}`,
      duration: 0
    };

    if (currentSong?.id === song.id.videoId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(songData);
      setIsPlaying(true);
    }
  };

  const toggleLike = (song: YouTubeSearchResult) => {
    const songData: Song = {
      id: song.id.videoId,
      title: song.snippet.title,
      artist: song.snippet.channelTitle,
      thumbnail: song.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${song.id.videoId}`,
      duration: 0,
    };

    const isLiked = likedSongs.some(s => s.id === songData.id);
    
    if (isLiked) {
      removeFromLikedSongs(songData.id);
      toast.success("Removed from Liked Songs");
    } else {
      addToLikedSongs(songData);
      toast.success("Added to Liked Songs");
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 mb-8"
      >
        <Input
          placeholder="Search for songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-md bg-secondary/50"
        />
        <Button 
          onClick={() => handleSearch()}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </motion.div>

      <AnimatePresence>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {searchResults.map((result: any, index) => (
            <motion.div
              key={result.id.videoId}
              variants={item}
              className="bg-card rounded-lg overflow-hidden"
            >
              <Image
                src={result.snippet.thumbnails.medium.url}
                alt={result.snippet.title}
                width={320}
                height={180}
                className="w-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="p-4">
                <h3 className="font-semibold truncate">{result.snippet.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {result.snippet.channelTitle}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => playSong(result)}
                  >
                    {currentSong?.id === result.id.videoId && isPlaying ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {currentSong?.id === result.id.videoId && isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleLike(result)}
                    className={likedSongs.some(s => s.id === result.id.videoId) ? "text-primary" : ""}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        likedSongs.some(s => s.id === result.id.videoId) ? "fill-current" : ""
                      }`} 
                    />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          addToQueue({
                            id: result.id.videoId,
                            title: result.snippet.title,
                            artist: result.snippet.channelTitle,
                            thumbnail: result.snippet.thumbnails.medium.url,
                            url: `https://www.youtube.com/watch?v=${result.id.videoId}`,
                            duration: 0, // You'll need to get this from the YouTube API
                          });
                          toast.success("Added to queue");
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Queue
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedSong({
                            id: result.id.videoId,
                            title: result.snippet.title,
                            artist: result.snippet.channelTitle,
                            thumbnail: result.snippet.thumbnails.medium.url,
                            url: `https://www.youtube.com/watch?v=${result.id.videoId}`,
                            duration: 0,
                          });
                          setIsAddToPlaylistOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Playlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">AI Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec: any, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-card p-4 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <h3 className="font-semibold">{rec.title}</h3>
                <p className="text-sm text-muted-foreground">{rec.artist}</p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 text-primary"
                  onClick={() => {
                    setSearchQuery(`${rec.title} ${rec.artist}`);
                    handleSearch(`${rec.title} ${rec.artist}`);
                  }}
                >
                  Search This Song
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {selectedSong && (
        <AddToPlaylistDialog
          open={isAddToPlaylistOpen}
          onOpenChange={setIsAddToPlaylistOpen}
          song={selectedSong}
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
      )}
    </div>
  );
}