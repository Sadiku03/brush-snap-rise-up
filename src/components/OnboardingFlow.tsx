
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Clock, Calendar, Award, Moon, Sun } from "lucide-react";
import { calculateWakeUpPlan } from '@/utils/planCalculator';
import { useUserStore } from '@/store/userStore';
import { generateDailyQuests } from '@/utils/questManager';
import { useNavigate } from 'react-router-dom';

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [currentWakeTime, setCurrentWakeTime] = useState('08:00');
  const [targetWakeTime, setTargetWakeTime] = useState('06:00');
  const [targetDate, setTargetDate] = useState('');
  const navigate = useNavigate();
  
  const { setWakeUpPlan, name, completeOnboarding } = useUserStore();
  
  // Set target date default to 2 weeks from today
  useState(() => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    setTargetDate(twoWeeksFromNow.toISOString().split('T')[0]);
  });
  
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Final step - create the plan and complete onboarding
      const plan = calculateWakeUpPlan(currentWakeTime, targetWakeTime, targetDate);
      setWakeUpPlan(plan);
      completeOnboarding();
      navigate('/app');
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-lilac/20 max-w-2xl w-full overflow-hidden">
        {/* Progress Indicator */}
        <div className="bg-skyblue/20 p-4 border-b border-lilac/10">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`relative flex items-center justify-center 
                  ${s < step ? 'text-coral' : s === step ? 'text-indigo' : 'text-indigo/30'}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
                    ${s < step 
                      ? 'border-coral bg-coral/10' 
                      : s === step 
                        ? 'border-indigo bg-indigo/10' 
                        : 'border-indigo/30 bg-white'}`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div 
                    className={`absolute w-full h-0.5 left-1/2 top-5 -z-10
                      ${s < step ? 'bg-coral' : 'bg-indigo/30'}`}
                    style={{ width: 'calc(100% - 2.5rem)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo mb-2">
                  Welcome to RiseQuest{name ? `, ${name}` : ''}!
                </h2>
                <p className="text-indigo/70">
                  Let's set up your personal wake-up journey.
                </p>
              </div>
              
              <div className="bg-lilac/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Moon className="h-5 w-5 text-indigo" />
                  How RiseQuest Works
                </h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-skyblue/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-indigo/80">
                      Tell us your current wake-up time and your goal time
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-skyblue/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-indigo/80">
                      We'll create a gradual adjustment plan with small, achievable steps
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-skyblue/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-indigo/80">
                      Complete daily quests and take wake-up verification photos
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-skyblue/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <p className="text-indigo/80">
                      Earn XP and watch your sleep companion grow as you progress
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo mb-2">
                  Your Current Schedule
                </h2>
                <p className="text-indigo/70">
                  Let's start with when you currently wake up.
                </p>
              </div>
              
              <div className="bg-skyblue/10 p-6 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-center">
                <div className="flex items-center gap-2 text-indigo">
                  <Clock className="h-6 w-6" />
                  <span className="font-medium">Current Wake-Up Time</span>
                </div>
                
                <Input
                  type="time"
                  value={currentWakeTime}
                  onChange={(e) => setCurrentWakeTime(e.target.value)}
                  className="input-field w-full sm:w-40 text-lg text-center"
                />
              </div>
              
              <div className="bg-lilac/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">Why is this important?</h3>
                <p className="text-indigo/80">
                  Your current wake-up time is our starting point. We'll create a personalized plan that 
                  gradually shifts your wake-up time toward your goal, which is much more effective 
                  than making sudden changes.
                </p>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo mb-2">
                  Your Goal
                </h2>
                <p className="text-indigo/70">
                  Now tell us your target wake-up time and when you want to achieve it.
                </p>
              </div>
              
              <div className="space-y-5">
                <div className="bg-skyblue/10 p-6 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <div className="flex items-center gap-2 text-indigo">
                    <Sun className="h-6 w-6" />
                    <span className="font-medium">Target Wake-Up Time</span>
                  </div>
                  
                  <Input
                    type="time"
                    value={targetWakeTime}
                    onChange={(e) => setTargetWakeTime(e.target.value)}
                    className="input-field w-full sm:w-40 text-lg text-center"
                  />
                </div>
                
                <div className="bg-skyblue/10 p-6 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <div className="flex items-center gap-2 text-indigo">
                    <Calendar className="h-6 w-6" />
                    <span className="font-medium">Target Date</span>
                  </div>
                  
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="input-field w-full sm:w-40 text-lg"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="bg-lilac/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">How We'll Help You Get There</h3>
                <p className="text-indigo/80">
                  Based on the information you've provided, we'll create a step-by-step plan with small, 
                  manageable wake-up time adjustments. Your body will have time to adapt, making the 
                  transition much easier and more sustainable.
                </p>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo mb-2">
                  You're All Set!
                </h2>
                <p className="text-indigo/70">
                  Here's a preview of your personalized wake-up journey.
                </p>
              </div>
              
              <div className="bg-skyblue/10 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-indigo">
                    <p className="text-sm">Current</p>
                    <p className="text-xl font-semibold">{currentWakeTime}</p>
                  </div>
                  
                  <div className="h-0.5 flex-1 bg-indigo/10 mx-4 relative">
                    <div className="absolute inset-y-0 left-0 bg-coral" style={{ width: '20%' }} />
                  </div>
                  
                  <div className="text-indigo">
                    <p className="text-sm">Target</p>
                    <p className="text-xl font-semibold">{targetWakeTime}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-indigo/70">
                  <span>Today</span>
                  <span>{new Date(targetDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="bg-coral/10 p-6 rounded-xl border border-coral/20">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-6 w-6 text-coral" />
                  <h3 className="text-lg font-semibold text-indigo">Ready for Your Quest</h3>
                </div>
                
                <p className="text-indigo/80 mb-4">
                  You'll receive daily quests that help you build better sleep habits. Complete these 
                  quests to earn XP and level up your sleep companion!
                </p>
                
                <div className="bg-white/50 p-4 rounded-lg border border-coral/10">
                  <p className="font-medium text-center text-indigo">Your first quest:</p>
                  <p className="text-center text-coral font-semibold mt-1">
                    "Take a wake-up verification photo tomorrow morning"
                  </p>
                </div>
              </div>
              
              <div className="text-center text-indigo/70 mt-4">
                <p>Click "Start My Journey" to begin your adventure!</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="p-6 bg-indigo/5 border-t border-lilac/10 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className={`${step === 1 ? 'invisible' : ''} flex items-center gap-2`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            className="btn-primary flex items-center gap-2"
          >
            {step < 4 ? (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              'Start My Journey'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
