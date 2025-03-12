"use client";

import { useState, useEffect, useRef } from "react";
import { usePlayerStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Repeat, Shuffle,
  ListMusic
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from 'next/image';
import type ReactPlayer from 'react-player';

// Define the type for the player instance
type PlayerRef = ReactPlayer & {
  seekTo(amount: number, type?: "seconds" | "fraction"): void;
};

// Dynamically import ReactPlayer with SSR disabled
const ReactPlayer = dynamic<ReactPlayerType>(() => import('react-player/lazy'), {
  ssr: false,
});

interface ReactPlayerType {
  seekTo: (amount: number, type?: 'seconds' | 'fraction') => void;
  getInternalPlayer: () => any;
}

export function Player() {
  const { 
    currentSong, 
    isPlaying, 
    setIsPlaying,
    volume,
    setVolume,
    queue,
    removeFromQueue,
    clearQueue
  } = usePlayerStore();
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [ready, setReady] = useState(false);
  const playerRef = useRef<ReactPlayerType | null>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setVolume(volume === 0 ? 1 : 0);
  const toggleRepeat = () => setRepeat(!repeat);
  const toggleShuffle = () => setShuffle(!shuffle);

  const handleProgress = (state: { playedSeconds: number }) => {
    setProgress(state.playedSeconds);
  };

  const handleSliderChange = (value: number[]) => {
    setProgress(value[0]);
    playerRef.current?.seekTo(value[0]);
  };

  const handleReady = () => {
    setReady(true);
    if (isPlaying) {
      playerRef.current?.seekTo(0);
    }
  };

  const handleError = () => {
    console.error("Error playing video");
    setIsPlaying(false);
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-24 bg-card border-t border-border player-gradient"
    >
      <div className="h-full px-4 py-2 flex items-center justify-between">
        {/* Current Song Info */}
        <AnimatePresence mode="wait">
          {currentSong && (
            <motion.div 
              key={currentSong.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center w-1/3"
            >
              <Image 
                src={currentSong.thumbnail}
                alt={currentSong.title}
                width={64}
                height={64}
                className="w-16 h-16 rounded-md mr-4 object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+yHgAFWAJ/pNyaswAAAABJRU5ErkJggg=="
              />
              <div className="overflow-hidden">
                <p className="font-medium truncate">{currentSong.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentSong.artist}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleShuffle}
              className={shuffle ? "text-primary" : ""}
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleRepeat}
              className={repeat ? "text-primary" : ""}
            >
              <Repeat className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="w-full flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground min-w-[40px]">
              {formatTime(progress)}
            </span>
            <Slider
              value={[progress]}
              max={duration}
              step={1}
              className="w-full"
              onValueChange={handleSliderChange}
              disabled={!currentSong}
            />
            <span className="text-xs text-muted-foreground min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control and Queue */}
        <div className="flex items-center gap-4 w-1/3 justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <ListMusic className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Queue</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                {queue && queue.length > 0 ? (
                  queue.map((song, index) => (
                    <motion.div
                      key={`${song.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50"
                    >
                      <Image
                        src={song.thumbnail}
                        alt={song.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+yHgAFWAJ/pNyaswAAAABJRU5ErkJggg=="
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {song.artist}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromQueue(song.id)}
                      >
                        Remove
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No songs in queue
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMute}
          >
            {volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          <Slider
            value={[volume * 100]}
            max={100}
            className="w-28"
            onValueChange={([value]) => setVolume(value / 100)}
          />
        </div>

        {/* Hidden ReactPlayer */}
        {currentSong && (
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${currentSong.id}`}
            playing={isPlaying}
            volume={volume}
            width={0}
            height={0}
            onReady={handleReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onDuration={setDuration}
            onProgress={handleProgress}
            onError={handleError}
            onEnded={() => {
              if (repeat) {
                playerRef.current?.seekTo(0);
              } else {
                setIsPlaying(false);
              }
            }}
            config={{
              youtube: {
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  disablekb: 1,
                  fs: 0,
                  modestbranding: 1,
                  rel: 0,
                }
              }
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}