
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Moon, PlayCircle, PauseCircle, SkipBack, Volume2, Music, 
  Clock, ChevronDown, ChevronUp
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

const WindDownZone = () => {
  const [expanded, setExpanded] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  
  const breathingIntervalRef = useRef<number | null>(null);
  
  // Sounds available in the Wind-Down Zone
  const availableSounds = [
    { id: 'rain', name: 'Gentle Rain' },
    { id: 'waves', name: 'Ocean Waves' },
    { id: 'forest', name: 'Forest Ambience' },
    { id: 'whitenoise', name: 'White Noise' },
  ];
  
  // Breathing exercise logic
  useEffect(() => {
    if (breathingActive) {
      const startBreathingExercise = () => {
        // Clear any existing interval
        if (breathingIntervalRef.current) {
          clearInterval(breathingIntervalRef.current);
        }
        
        // Set initial phase
        setBreathingPhase('inhale');
        setBreathingTimer(4); // 4 seconds for inhale
        
        // Start the interval
        let currentPhase: 'inhale' | 'hold' | 'exhale' | 'rest' = 'inhale';
        let timeRemaining = 4;
        
        breathingIntervalRef.current = window.setInterval(() => {
          timeRemaining -= 1;
          setBreathingTimer(timeRemaining);
          
          if (timeRemaining <= 0) {
            // Transition to next phase
            switch (currentPhase) {
              case 'inhale':
                currentPhase = 'hold';
                timeRemaining = 7; // 7 seconds for hold
                break;
              case 'hold':
                currentPhase = 'exhale';
                timeRemaining = 8; // 8 seconds for exhale
                break;
              case 'exhale':
                currentPhase = 'inhale';
                timeRemaining = 4; // Back to inhale
                break;
              default:
                currentPhase = 'inhale';
                timeRemaining = 4;
            }
            
            setBreathingPhase(currentPhase);
            setBreathingTimer(timeRemaining);
          }
        }, 1000);
      };
      
      startBreathingExercise();
    } else {
      // Clean up interval when breathing exercise is stopped
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
        breathingIntervalRef.current = null;
      }
      
      setBreathingPhase('rest');
    }
    
    // Clean up interval on component unmount
    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
    };
  }, [breathingActive]);
  
  // Handle playing sound
  const handlePlaySound = (soundId: string) => {
    setSelectedSound(soundId);
    setSoundPlaying(true);
  };
  
  // Breathing instructions based on phase
  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe in slowly';
      case 'hold':
        return 'Hold your breath';
      case 'exhale':
        return 'Breathe out slowly';
      default:
        return 'Prepare to breathe';
    }
  };
  
  // Get breathing circle size based on phase
  const getBreathingCircleSize = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'scale-110';
      case 'hold':
        return 'scale-110';
      case 'exhale':
        return 'scale-100';
      default:
        return 'scale-100';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-lilac/20 overflow-hidden">
      <div className="bg-skyblue/20 border-b border-lilac/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-indigo" />
          <h2 className="text-xl font-bold text-indigo">Wind-Down Zone</h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-indigo/70"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className={`transition-all duration-300 ${expanded ? 'max-h-[600px]' : 'max-h-80'} overflow-hidden`}>
        <div className="p-5">
          <div className="text-center mb-4">
            <p className="text-indigo/70">
              Prepare your mind and body for sleep with relaxation tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Breathing Exercise */}
            <div className="bg-skyblue/10 rounded-xl p-5 border border-skyblue/20">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-indigo" />
                <h3 className="font-semibold text-indigo">4-7-8 Breathing</h3>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div 
                    className={`w-36 h-36 rounded-full bg-skyblue/20 border-4 border-skyblue flex items-center justify-center transition-all duration-1000 ${getBreathingCircleSize()}`}
                  >
                    <div className="text-indigo font-medium">
                      {breathingActive ? breathingTimer : ''}
                    </div>
                  </div>
                  
                  {breathingActive && (
                    <div className="absolute -bottom-6 left-0 right-0 text-center">
                      <p className="text-indigo/70 font-medium">
                        {getBreathingInstruction()}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 w-full flex justify-center gap-3">
                  {breathingActive ? (
                    <Button
                      onClick={() => setBreathingActive(false)}
                      variant="outline"
                      className="border-lilac/30 flex items-center gap-2"
                    >
                      <PauseCircle className="h-4 w-4" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setBreathingActive(true)}
                      className="bg-skyblue hover:bg-skyblue/80 text-indigo flex items-center gap-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Start
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Ambient Sounds */}
            <div className="bg-lilac/10 rounded-xl p-5 border border-lilac/20">
              <div className="flex items-center gap-2 mb-4">
                <Music className="h-5 w-5 text-indigo" />
                <h3 className="font-semibold text-indigo">Ambient Sounds</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {availableSounds.map(sound => (
                    <Button
                      key={sound.id}
                      variant={selectedSound === sound.id ? 'default' : 'outline'}
                      className={selectedSound === sound.id 
                        ? 'bg-coral text-white hover:bg-coral/90' 
                        : 'border-lilac/30'
                      }
                      onClick={() => handlePlaySound(sound.id)}
                    >
                      {sound.name}
                    </Button>
                  ))}
                </div>
                
                {selectedSound && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="h-4 w-4 text-indigo/70" />
                      <span className="text-sm text-indigo/70">Volume</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Slider
                        defaultValue={[volume]}
                        max={100}
                        step={1}
                        onValueChange={(values) => setVolume(values[0])}
                        className="flex-1"
                      />
                      <span className="text-sm text-indigo/70 w-8 text-right">
                        {volume}%
                      </span>
                    </div>
                    
                    <div className="flex justify-center mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-lilac/30 text-indigo w-full flex justify-center gap-2"
                        onClick={() => setSoundPlaying(!soundPlaying)}
                      >
                        {soundPlaying ? (
                          <>
                            <PauseCircle className="h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4" />
                            Play
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {expanded && (
            <div className="mt-5 bg-coral/10 p-4 rounded-lg border border-coral/20">
              <h3 className="font-semibold text-indigo mb-2">Wind-Down Tips</h3>
              <ul className="space-y-2 text-sm text-indigo/80">
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-coral/20 flex-shrink-0 mt-0.5" />
                  <span>Dim the lights in your room 30 minutes before bed</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-coral/20 flex-shrink-0 mt-0.5" />
                  <span>Avoid screens or use night mode to reduce blue light exposure</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-coral/20 flex-shrink-0 mt-0.5" />
                  <span>Keep your bedroom cool, around 65-68°F (18-20°C)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-coral/20 flex-shrink-0 mt-0.5" />
                  <span>Practice the 4-7-8 breathing exercise while lying in bed</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WindDownZone;
