"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Pause, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchYouTube } from "@/lib/youtube";
import { getRecommendations } from "@/lib/gemini";
import { usePlayerStore } from "@/lib/store";
import { toast } from "sonner";

export function MainContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentSong, setCurrentSong, isPlaying, setIsPlaying, addToQueue } = usePlayerStore();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchYouTube(searchQuery);
      setSearchResults(results);
      
      const aiRecs = await getRecommendations(searchQuery);
      setRecommendations(aiRecs);
    } catch (error) {
      toast.error("Failed to search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const playSong = (song: any) => {
    const songData = {
      id: song.id.videoId,
      title: song.snippet.title,
      artist: song.snippet.channelTitle,
      thumbnail: song.snippet.thumbnails.medium.url,
    };

    if (currentSong?.id === song.id.videoId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(songData);
      setIsPlaying(true);
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
          onClick={handleSearch} 
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
              className="song-card"
            >
              <img
                src={result.snippet.thumbnails.medium.url}
                alt={result.snippet.title}
                className="w-full aspect-video object-cover"
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
                    onClick={() => {
                      addToQueue({
                        id: result.id.videoId,
                        title: result.snippet.title,
                        artist: result.snippet.channelTitle,
                        thumbnail: result.snippet.thumbnails.medium.url,
                      });
                      toast.success("Added to queue");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Queue
                  </Button>
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
                  onClick={() => handleSearch(`${rec.title} ${rec.artist}`)}
                >
                  Search This Song
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}