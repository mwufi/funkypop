"use client";

import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FONT_OPTIONS = [
    { value: 'montserrat', label: 'Montserrat' },
    { value: 'dmseriftext', label: 'DM Serif Text' },
    { value: 'playfair', label: 'Playfair Display' },
    { value: 'cinzel', label: 'Cinzel' },
];

const PRESETS = {
    'Gentle Fade': {
        size: 100,
        shadowBlur: 20,
        shadowOpacity: 0.3,
        x: 50,
        y: 50,
    },
    'Dramatic': {
        size: 120,
        shadowBlur: 40,
        shadowOpacity: 0.5,
        x: 50,
        y: 50,
    },
    'Minimal': {
        size: 90,
        shadowBlur: 10,
        shadowOpacity: 0.2,
        x: 50,
        y: 50,
    }
};

interface CinematicControlsProps {
    onUpdate: (settings: any) => void;
}

export function CinematicControls({ onUpdate }: CinematicControlsProps) {
    const [settings, setSettings] = React.useState({
        font: 'montserrat',
        size: 100,
        shadowBlur: 20,
        shadowOpacity: 0.3,
        x: 50,
        y: 50,
    });

    const updateSettings = (newSettings: Partial<typeof settings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        onUpdate(updated);
    };

    const applyPreset = (preset: keyof typeof PRESETS) => {
        updateSettings(PRESETS[preset]);
    };

    return (
        <Card className="w-80 p-4 bg-gray-900/50 backdrop-blur-sm text-white">
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
                    <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    {/* Font Selection */}
                    <div className="space-y-2">
                        <Label>Font</Label>
                        <Select
                            value={settings.font}
                            onValueChange={(value) => updateSettings({ font: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {FONT_OPTIONS.map((font) => (
                                    <SelectItem key={font.value} value={font.value}>
                                        {font.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Size Control */}
                    <div className="space-y-2">
                        <Label>Size ({settings.size}%)</Label>
                        <Slider
                            value={[settings.size]}
                            onValueChange={([value]) => updateSettings({ size: value })}
                            min={50}
                            max={200}
                            step={1}
                        />
                    </div>

                    {/* Position Controls */}
                    <div className="space-y-2">
                        <Label>Position X ({settings.x}%)</Label>
                        <Slider
                            value={[settings.x]}
                            onValueChange={([value]) => updateSettings({ x: value })}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Position Y ({settings.y}%)</Label>
                        <Slider
                            value={[settings.y]}
                            onValueChange={([value]) => updateSettings({ y: value })}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                    {/* Shadow Controls */}
                    <div className="space-y-2">
                        <Label>Shadow Blur ({settings.shadowBlur}px)</Label>
                        <Slider
                            value={[settings.shadowBlur]}
                            onValueChange={([value]) => updateSettings({ shadowBlur: value })}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Shadow Opacity ({Math.round(settings.shadowOpacity * 100)}%)</Label>
                        <Slider
                            value={[settings.shadowOpacity * 100]}
                            onValueChange={([value]) => updateSettings({ shadowOpacity: value / 100 })}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </div>

                    {/* Presets */}
                    <div className="space-y-2">
                        <Label>Presets</Label>
                        <Select onValueChange={(value) => applyPreset(value as keyof typeof PRESETS)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a preset" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(PRESETS).map((preset) => (
                                    <SelectItem key={preset} value={preset}>
                                        {preset}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>
            </Tabs>
        </Card>
    );
} 