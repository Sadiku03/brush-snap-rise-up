
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Check, Image as ImageIcon } from "lucide-react";
import { useUserStore } from '@/store/userStore';
import { generateVerificationPrompt } from '@/utils/questManager';
import { isValidWakeUpTime } from '@/utils/planCalculator';
import { useToast } from '@/components/ui/use-toast';

const BrushSnap = () => {
  const [captureMode, setCaptureMode] = useState<'inactive' | 'camera' | 'upload'>('inactive');
  const [image, setImage] = useState<string | null>(null);
  const [verificationPrompt, setVerificationPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addBrushSnap, wakeUpPlan, recordWakeUp, brushSnaps } = useUserStore();
  const { toast } = useToast();
  
  const generatePrompt = () => {
    const prompt = generateVerificationPrompt();
    setVerificationPrompt(prompt);
  };
  
  const handleStartCapture = (mode: 'camera' | 'upload') => {
    setCaptureMode(mode);
    generatePrompt();
    
    if (mode === 'upload' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleCancel = () => {
    setCaptureMode('inactive');
    setImage(null);
  };
  
  const handleSubmit = () => {
    if (!image) return;
    
    // In a real app, we would verify the timestamp from EXIF data
    // For now, we'll simulate a verification
    const timestamp = Date.now();
    const isValidTime = wakeUpPlan ? isValidWakeUpTime(wakeUpPlan, timestamp) : true;
    
    if (isValidTime) {
      const today = new Date().toISOString().split('T')[0];
      
      // Add the brush snap
      addBrushSnap({
        id: Date.now().toString(),
        date: today,
        imageUrl: image,
        prompt: verificationPrompt
      });
      
      // Mark today's wake-up as completed
      if (wakeUpPlan) {
        recordWakeUp(today);
      }
      
      toast({
        title: "Wake-Up Verified!",
        description: "Great job! You've successfully verified your wake-up.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "This doesn't seem to be within your scheduled wake-up window.",
        variant: "destructive",
        duration: 3000,
      });
    }
    
    setCaptureMode('inactive');
    setImage(null);
  };
  
  // Check if user already has a verification for today
  const today = new Date().toISOString().split('T')[0];
  const alreadyVerifiedToday = brushSnaps.some(snap => snap.date === today);
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-lilac/20 overflow-hidden">
      <div className="bg-skyblue/20 border-b border-lilac/10 p-4">
        <h2 className="text-xl font-bold text-indigo">
          Brush Snap Verification
        </h2>
      </div>
      
      <div className="p-5">
        {captureMode === 'inactive' ? (
          <div>
            {alreadyVerifiedToday ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-indigo mb-1">
                  Already Verified Today
                </h3>
                <p className="text-indigo/70 text-sm mb-4">
                  Great job! You've already completed your wake-up verification for today.
                </p>
                <div className="bg-skyblue/10 p-3 rounded-lg">
                  <p className="text-sm text-indigo/80">
                    Come back tomorrow to continue your streak!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-indigo/70">
                  Verify you're awake by taking a selfie with your toothbrush or 
                  uploading a morning photo.
                </p>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    onClick={() => handleStartCapture('camera')}
                    className="bg-skyblue text-indigo hover:bg-skyblue/80 h-32 flex flex-col gap-2"
                  >
                    <Camera className="h-8 w-8" />
                    <span>Take Photo</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleStartCapture('upload')}
                    className="bg-lilac/20 text-indigo hover:bg-lilac/30 h-32 flex flex-col gap-2"
                  >
                    <Upload className="h-8 w-8" />
                    <span>Upload Photo</span>
                  </Button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
                
                <div className="bg-coral/10 p-4 rounded-lg border border-coral/20 mt-2">
                  <h3 className="font-medium text-indigo mb-1">Why verify?</h3>
                  <p className="text-sm text-indigo/80">
                    Morning verification helps build accountability and maintains your streak.
                    It's a great way to track your progress visually over time!
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-skyblue/10 p-4 rounded-lg border border-skyblue/20">
              <p className="font-medium text-indigo mb-1">Verification Prompt:</p>
              <p className="text-indigo/80">{verificationPrompt}</p>
            </div>
            
            {image ? (
              <div className="relative rounded-lg overflow-hidden border border-lilac/30">
                <img src={image} alt="Verification" className="w-full h-64 object-cover" />
              </div>
            ) : captureMode === 'camera' ? (
              <div className="bg-indigo/5 border border-dashed border-indigo/30 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-10 w-10 text-indigo/40 mx-auto mb-2" />
                  <p className="text-indigo/60">
                    Camera integration will be available in a future update
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-indigo/5 border border-dashed border-indigo/30 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-10 w-10 text-indigo/40 mx-auto mb-2" />
                  <p className="text-indigo/60">
                    Drag and drop an image or click "Upload"
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              
              {image ? (
                <Button
                  onClick={handleSubmit}
                  className="btn-primary flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  Verify
                </Button>
              ) : captureMode === 'upload' ? (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary flex items-center gap-1"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              ) : (
                <Button
                  onClick={() => setImage('https://source.unsplash.com/random/800x600/?morning,toothbrush')}
                  className="btn-primary flex items-center gap-1"
                >
                  <Camera className="h-4 w-4" />
                  Capture
                </Button>
              )}
            </div>
          </div>
        )}
        
        {brushSnaps.length > 0 && captureMode === 'inactive' && (
          <div className="mt-6">
            <h3 className="font-medium text-indigo mb-3">Your Morning Mosaic</h3>
            <div className="grid grid-cols-3 gap-2">
              {brushSnaps.slice(0, 6).map((snap, index) => (
                <div 
                  key={snap.id} 
                  className="aspect-square rounded-md overflow-hidden border border-lilac/20"
                >
                  <img 
                    src={snap.imageUrl} 
                    alt={`Verification ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {brushSnaps.length > 6 && (
                <div className="aspect-square rounded-md bg-lilac/10 flex items-center justify-center">
                  <span className="text-indigo/70 font-medium">
                    +{brushSnaps.length - 6} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrushSnap;
