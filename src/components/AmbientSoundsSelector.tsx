
import { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface AmbientSoundsSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SoundCategory {
  id: string;
  name: string;
  sounds: Sound[];
}

interface Sound {
  id: string;
  name: string;
  icon: string;
}

const AmbientSoundsSelector = ({ isOpen, onClose }: AmbientSoundsSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('nature');
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  
  // Sound categories
  const soundCategories: SoundCategory[] = [
    {
      id: 'nature',
      name: 'Nature',
      sounds: [
        { id: 'rain', name: 'Gentle Rain', icon: '🌧️' },
        { id: 'waves', name: 'Ocean Waves', icon: '🌊' },
        { id: 'forest', name: 'Forest', icon: '🌲' },
        { id: 'birds', name: 'Singing Birds', icon: '🐦' },
      ]
    },
    {
      id: 'white-noise',
      name: 'White Noise',
      sounds: [
        { id: 'white', name: 'White Noise', icon: '📻' },
        { id: 'pink', name: 'Pink Noise', icon: '🔊' },
        { id: 'brown', name: 'Brown Noise', icon: '🎧' },
        { id: 'fan', name: 'Fan Sound', icon: '💨' },
      ]
    },
    {
      id: 'binaural',
      name: 'Binaural Beats',
      sounds: [
        { id: 'delta', name: 'Delta (Sleep)', icon: '😴' },
        { id: 'theta', name: 'Theta (Relaxation)', icon: '🧘' },
        { id: 'alpha', name: 'Alpha (Focus)', icon: '🧠' },
        { id: 'gamma', name: 'Gamma (Awareness)', icon: '✨' },
      ]
    }
  ];
  
  // Find current category and sounds
  const currentCategory = soundCategories.find(c => c.id === selectedCategory);
  
  // Handle play/pause sound
  const togglePlay = (soundId: string) => {
    if (selectedSound === soundId && isPlaying) {
      setIsPlaying(false);
    } else {
      setSelectedSound(soundId);
      setIsPlaying(true);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md overflow-hidden bg-gradient-to-b from-lilac/5 to-skyblue/10 backdrop-blur-sm border-lilac/20">
        <div className="absolute right-4 top-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full h-8 w-8 text-indigo/70 hover:text-indigo hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="pt-6">
          <h2 className="text-xl font-semibold text-indigo mb-4 text-center">Ambient Sounds</h2>
          
          <div className="grid grid-cols-3 gap-2 mb-6">
            {soundCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={selectedCategory === category.id 
                  ? "bg-lilac/90 hover:bg-lilac border-none text-indigo" 
                  : "border-lilac/30 bg-white/50 text-indigo/70"
                }
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-4">
            {currentCategory?.sounds.map((sound) => (
              <Card 
                key={sound.id} 
                className="flex items-center p-3 shadow-sm bg-white/70 border-lilac/20 hover:shadow transition-all"
              >
                <div className="flex-shrink-0 text-xl w-8">{sound.icon}</div>
                <div className="flex-1 ml-3">{sound.name}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePlay(sound.id)}
                  className={`rounded-full ${
                    selectedSound === sound.id && isPlaying
                      ? "text-coral hover:text-coral/90"
                      : "text-indigo/70 hover:text-indigo"
                  }`}
                >
                  {selectedSound === sound.id && isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
              </Card>
            ))}
          </div>
          
          {selectedSound && (
            <div className="border-t border-lilac/20 pt-4">
              <div className="flex items-center gap-3 mb-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo/70 hover:text-indigo rounded-full p-0 h-8 w-8"
                  onClick={() => setVolume(volume === 0 ? 70 : 0)}
                >
                  {volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={(values) => setVolume(values[0])}
                  className="flex-1"
                />
                
                <span className="text-sm text-indigo/70 w-8">
                  {volume}%
                </span>
              </div>
              
              <div className="text-center text-xs text-indigo/60 mt-2">
                Sound will automatically stop after 30 minutes
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AmbientSoundsSelector;
