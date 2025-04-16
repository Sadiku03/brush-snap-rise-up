
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Moon, PlayCircle, PauseCircle, ChevronDown, ChevronUp,
  Clock, Music, CloudMoon, Sparkles, Bed
} from "lucide-react";
import WindDownToolCard from './WindDownToolCard';
import BreathingExercise from './BreathingExercise';
import AmbientSoundsSelector from './AmbientSoundsSelector';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const WindDownZone = () => {
  const [expanded, setExpanded] = useState(false);
  const [breathingDialogOpen, setBreathingDialogOpen] = useState(false);
  const [soundsDialogOpen, setSoundsDialogOpen] = useState(false);
  const [startingRoutine, setStartingRoutine] = useState(false);
  
  // Start a complete wind-down routine
  const startWindDownRoutine = () => {
    setStartingRoutine(true);
    
    // Start with breathing exercise
    setBreathingDialogOpen(true);
    
    // After breathing completes, show ambient sounds
    setTimeout(() => {
      setBreathingDialogOpen(false);
      setSoundsDialogOpen(true);
      setStartingRoutine(false);
    }, 60000); // Approximate time for 3 breathing cycles
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-lilac/20 overflow-hidden">
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <div className="bg-gradient-to-r from-skyblue/20 to-lilac/20 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo" />
            <h2 className="text-xl font-bold text-indigo">Wind-Down Zone</h2>
          </div>
          
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-indigo/70"
            >
              {expanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <div className="p-5 space-y-5">
          <div className="text-center mb-4">
            <p className="text-indigo/70 text-base leading-relaxed">
              Simple, proven rituals to help your body relax and your mind slow down.
            </p>
          </div>
          
          {/* One-tap wind-down routine button */}
          <Button
            onClick={startWindDownRoutine}
            disabled={startingRoutine}
            className="w-full bg-coral hover:bg-coral/90 text-white p-6 rounded-xl shadow-sm transition-all duration-300 flex justify-center items-center gap-2 h-auto"
          >
            <CloudMoon className="h-5 w-5" />
            <span className="font-medium">Start Wind-Down Routine</span>
          </Button>
          
          {/* Vertical stack of wind-down tools */}
          <div className="space-y-4 mt-6">
            <WindDownToolCard
              icon={<Clock className="h-6 w-6 text-skyblue" />}
              title="4-7-8 Breathing"
              description="A guided breathing technique to calm your nervous system and prepare for sleep"
              onClick={() => setBreathingDialogOpen(true)}
              actionLabel="Begin"
              color="blue"
            />
            
            <WindDownToolCard
              icon={<Music className="h-6 w-6 text-lilac" />}
              title="Ambient Sounds"
              description="Calming audio environments to mask distractions and create a peaceful atmosphere"
              onClick={() => setSoundsDialogOpen(true)}
              actionLabel="Browse"
              color="purple"
            />
            
            <WindDownToolCard
              icon={<Sparkles className="h-6 w-6 text-coral" />}
              title="Bedtime Reflection"
              description="End your day with gratitude and set intentions for tomorrow"
              onClick={() => {}}
              actionLabel="Open"
              color="coral"
            />
          </div>
          
          <CollapsibleContent>
            <div className="mt-5 p-5 bg-gradient-to-r from-coral/5 to-skyblue/5 rounded-xl border border-lilac/10">
              <div className="flex items-center gap-2 mb-3">
                <Bed className="h-5 w-5 text-indigo" />
                <h3 className="font-semibold text-indigo">Sleep Science Tips</h3>
              </div>
              
              <ul className="space-y-3 text-sm text-indigo/80">
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-coral/20 flex-shrink-0 mt-0.5" />
                  <span>Dim the lights in your room 30-60 minutes before bedtime to signal your body it's time to wind down</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-coral/20 flex-shrink-0 mt-0.5" />
                  <span>Avoid screens or use night mode to reduce blue light exposure that interferes with melatonin production</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-coral/20 flex-shrink-0 mt-0.5" />
                  <span>Keep your bedroom cool (65-68°F / 18-20°C) for optimal sleep conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-coral/20 flex-shrink-0 mt-0.5" />
                  <span>Establish a consistent bedtime ritual - this reinforces your body's sleep-wake cycle</span>
                </li>
              </ul>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
      
      {/* Tool dialogs */}
      <BreathingExercise 
        isOpen={breathingDialogOpen}
        onClose={() => setBreathingDialogOpen(false)}
      />
      
      <AmbientSoundsSelector
        isOpen={soundsDialogOpen}
        onClose={() => setSoundsDialogOpen(false)}
      />
    </div>
  );
};

export default WindDownZone;
