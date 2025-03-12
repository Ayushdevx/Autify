"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function UserProfile() {
  const { user, updateUserPreferences } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Theme</label>
            <Select
              value={user.preferences.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') =>
                updateUserPreferences({ theme: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Audio Quality</label>
            <Select
              value={user.preferences.audioQuality}
              onValueChange={(value: 'auto' | 'high' | 'medium' | 'low') =>
                updateUserPreferences({ audioQuality: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Crossfade</label>
            <Switch
              checked={user.preferences.crossfade}
              onCheckedChange={(checked) =>
                updateUserPreferences({ crossfade: checked })
              }
            />
          </div>

          {user.preferences.crossfade && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Crossfade Duration</label>
              <Slider
                value={[user.preferences.crossfadeDuration]}
                min={1}
                max={12}
                step={1}
                onValueChange={([value]) =>
                  updateUserPreferences({ crossfadeDuration: value })
                }
              />
              <p className="text-sm text-muted-foreground text-right">
                {user.preferences.crossfadeDuration} seconds
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}