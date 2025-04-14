import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Moon, Sun, Star, Award, AlarmCheck } from "lucide-react";
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'features'>('about');
  const navigate = useNavigate();
  const { name, setUser, completeOnboarding } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const handleStartClick = () => {
    if (name) {
      // If already have a name, go straight to app
      navigate('/app');
    } else {
      // Otherwise show the form
      setShowForm(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUser(nameInput, emailInput);
      completeOnboarding();
      navigate('/app');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sand to-white">
      {/* Hero Section */}
      <section className="container px-4 py-12 md:py-20 mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-indigo">
            RiseQuest
          </h1>
          <p className="text-xl md:text-2xl text-indigo/80">
            Transform your morning routine into an adventure
          </p>
          <p className="text-lg text-indigo/70 max-w-xl">
            Gradually shift your sleep schedule with daily quests, XP rewards, and morning verifications.
          </p>
          <div className="pt-4">
            <Button 
              onClick={handleStartClick}
              className="btn-primary text-lg group flex items-center gap-2"
            >
              Begin Your Quest
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 relative animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-4 rounded-xl bg-coral/10 blur-xl animate-pulse-soft"></div>
            <div className="relative bg-white rounded-2xl border border-lilac/20 shadow-xl overflow-hidden">
              <div className="p-4 bg-skyblue/20 border-b border-lilac/10 flex items-center justify-center">
                <div className="w-32 h-24 bg-coral/20 rounded-full flex items-center justify-center">
                  <Moon className="h-12 w-12 text-indigo/70" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-lilac/20 rounded-full w-3/4 mx-auto"></div>
                <div className="h-4 bg-lilac/10 rounded-full w-full"></div>
                <div className="h-4 bg-lilac/10 rounded-full w-5/6"></div>
                <div className="h-10 bg-coral/70 rounded-full w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/4 w-20 h-20 bg-lilac rounded-full flex items-center justify-center shadow-lg animate-float">
            <Star className="h-10 w-10 text-indigo/70" />
          </div>
          
          <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 w-16 h-16 bg-skyblue rounded-full flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1s' }}>
            <Sun className="h-8 w-8 text-indigo/70" />
          </div>
        </div>
      </section>
      
      {/* Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-indigo/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-indigo mb-6">Join the Quest</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-indigo/70 mb-1">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-indigo/70 mb-1">
                  Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="pt-4 flex gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Start Adventure
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Tabs Section */}
      <section className="container px-4 py-16 mx-auto">
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-lilac/20 p-1">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'about' 
                  ? 'bg-white shadow text-indigo' 
                  : 'text-indigo/70 hover:text-indigo'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'features' 
                  ? 'bg-white shadow text-indigo' 
                  : 'text-indigo/70 hover:text-indigo'
              }`}
            >
              Features
            </button>
          </div>
        </div>
        
        <div className="animate-fade-in">
          {activeTab === 'about' ? (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-indigo text-center mb-8">Why RiseQuest?</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-effect rounded-xl p-6 card-shadow">
                  <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mb-4">
                    <Moon className="h-6 w-6 text-coral" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">The Sleep Challenge</h3>
                  <p className="text-indigo/70">
                    Abruptly changing your wake-up time is difficult and often unsustainable. 
                    Your body needs time to adjust to new sleep rhythms.
                  </p>
                </div>
                
                <div className="glass-effect rounded-xl p-6 card-shadow">
                  <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mb-4">
                    <Sun className="h-6 w-6 text-coral" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Gradual Adjustment</h3>
                  <p className="text-indigo/70">
                    RiseQuest breaks down your goal into small, achievable steps, 
                    shifting your wake-up time gradually for lasting change.
                  </p>
                </div>
                
                <div className="glass-effect rounded-xl p-6 card-shadow">
                  <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-coral" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fun & Motivating</h3>
                  <p className="text-indigo/70">
                    We transform habit-building into an adventure with quests, 
                    rewards, and a sleep companion that grows with your progress.
                  </p>
                </div>
                
                <div className="glass-effect rounded-xl p-6 card-shadow">
                  <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-coral" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                  <p className="text-indigo/70">
                    Our approach combines gamification with sleep science to 
                    create a system that makes early rising enjoyable and sustainable.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-indigo text-center mb-8">Key Features</h2>
              
              <div className="space-y-6">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-coral/20 rounded-full flex-shrink-0 flex items-center justify-center">
                    <AlarmCheck className="h-6 w-6 text-coral" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Smart Wake-Up Plan</h3>
                    <p className="text-indigo/70">
                      Enter your current wake time and where you want to be. We'll create a 
                      personalized adjustment plan with small, gradual shifts that your body can adapt to comfortably.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-coral/20 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Award className="h-6 w-6 text-coral" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Daily Quests & Rewards</h3>
                    <p className="text-indigo/70">
                      Complete sleep-related challenges to earn XP and increase your streak. 
                      Track your progress and unlock achievements as you build better sleep habits.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-coral/20 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Moon className="h-6 w-6 text-coral" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Sleep Companion</h3>
                    <p className="text-indigo/70">
                      Meet your personal sleep avatar that evolves as you progress. 
                      It responds to your consistency and celebrates your milestones.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-coral/20 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Sun className="h-6 w-6 text-coral" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Brush Snap Verification</h3>
                    <p className="text-indigo/70">
                      Take a quick morning selfie with your toothbrush to verify you're up. 
                      These snapshots create a visual morning journey you can look back on.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container px-4 py-16 mx-auto text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo mb-4">
            Ready to become a morning person?
          </h2>
          <p className="text-lg text-indigo/70 mb-8">
            Join RiseQuest today and transform your sleep schedule one quest at a time.
          </p>
          <Button 
            onClick={handleStartClick}
            className="btn-primary text-lg"
          >
            Start Your Journey
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-indigo/5 py-8 mt-auto">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-indigo/60">
                &copy; {new Date().getFullYear()} RiseQuest - All rights reserved
              </p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-sm text-indigo/60 hover:text-indigo transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-indigo/60 hover:text-indigo transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-indigo/60 hover:text-indigo transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
