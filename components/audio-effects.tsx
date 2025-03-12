"use client";

import { useEffect, useState } from 'react';
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioEffects {
  equalizer: {
    bass: number;
    mid: number;
    treble: number;
  };
  reverb: number;
  delay: number;
}

interface AudioEffectsProps {
  audioContext: AudioContext | null;
  audioRef: React.RefObject<HTMLAudioElement>;
  effects: AudioEffects;
  onEffectsChange: (effects: AudioEffects) => void;
}

export function AudioEffects({
  audioContext,
  audioRef,
  effects,
  onEffectsChange,
}: AudioEffectsProps) {
  const [nodes, setNodes] = useState<{
    bassEQ: BiquadFilterNode | null;
    midEQ: BiquadFilterNode | null;
    trebleEQ: BiquadFilterNode | null;
    reverb: ConvolverNode | null;
    delay: DelayNode | null;
  }>({
    bassEQ: null,
    midEQ: null,
    trebleEQ: null,
    reverb: null,
    delay: null,
  });

  useEffect(() => {
    if (!audioContext || !audioRef.current) return;

    // Create audio nodes
    const bassEQ = audioContext.createBiquadFilter();
    bassEQ.type = 'lowshelf';
    bassEQ.frequency.value = 200;

    const midEQ = audioContext.createBiquadFilter();
    midEQ.type = 'peaking';
    midEQ.frequency.value = 1000;

    const trebleEQ = audioContext.createBiquadFilter();
    trebleEQ.type = 'highshelf';
    trebleEQ.frequency.value = 3000;

    const delay = audioContext.createDelay(1.0);
    
    // Create reverb
    const reverb = audioContext.createConvolver();
    createReverbImpulse(audioContext).then(buffer => {
      reverb.buffer = buffer;
    });

    // Connect nodes
    const source = audioContext.createMediaElementSource(audioRef.current);
    source
      .connect(bassEQ)
      .connect(midEQ)
      .connect(trebleEQ)
      .connect(reverb)
      .connect(delay)
      .connect(audioContext.destination);

    setNodes({ bassEQ, midEQ, trebleEQ, reverb, delay });

    return () => {
      source.disconnect();
      bassEQ.disconnect();
      midEQ.disconnect();
      trebleEQ.disconnect();
      reverb.disconnect();
      delay.disconnect();
    };
  }, [audioContext, audioRef]);

  // Update effects when sliders change
  useEffect(() => {
    if (!nodes.bassEQ) return;
    nodes.bassEQ.gain.value = effects.equalizer.bass;
    nodes.midEQ!.gain.value = effects.equalizer.mid;
    nodes.trebleEQ!.gain.value = effects.equalizer.treble;
    nodes.delay!.delayTime.value = effects.delay;
  }, [effects, nodes]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Audio Effects</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Equalizer</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs">Bass</label>
                <Slider
                  value={[effects.equalizer.bass]}
                  min={-12}
                  max={12}
                  step={0.1}
                  onValueChange={([value]) => {
                    onEffectsChange({
                      ...effects,
                      equalizer: { ...effects.equalizer, bass: value }
                    });
                  }}
                />
              </div>
              {/* Similar sliders for mid and treble */}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Effects</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs">Reverb</label>
                <Slider
                  value={[effects.reverb]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => {
                    onEffectsChange({
                      ...effects,
                      reverb: value
                    });
                  }}
                />
              </div>
              <div>
                <label className="text-xs">Delay</label>
                <Slider
                  value={[effects.delay]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => {
                    onEffectsChange({
                      ...effects,
                      delay: value
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper function to create reverb impulse response
async function createReverbImpulse(audioContext: AudioContext) {
  const length = 2;
  const decay = 2.0;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(2, length * sampleRate, sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / channelData.length, decay);
    }
  }
  
  return buffer;
}