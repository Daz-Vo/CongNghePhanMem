import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>

      <main className="flex-1 flex flex-col">
        <section className="relative w-full py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="https://uxmagic.blob.core.windows.net/public/agent-images/hero-med-1779611524787-d5of8fj4cs6.png"
              alt="Medical AI Background" className="w-full h-full object-cover opacity-20 object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <iconify-icon icon="lucide:sparkles" class="text-base"></iconify-icon>
              <span>Powered by Advanced Medical AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground max-w-4xl leading-tight tracking-tight mb-6">
              Your Intelligent Companion for <span className="text-primary">Medical Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Instantly check drug interactions, explore comprehensive medicine details, and consult our AI assistant for
              safe, reliable healthcare information.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto">
              <button
                className="w-full sm:w-auto flex-1 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium text-base hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
                onClick={() => navigate('/chat')}
              >
                <iconify-icon icon="lucide:message-circle"></iconify-icon>
                Chat with AI
              </button>
              <button
                className="w-full sm:w-auto flex-1 bg-card text-foreground border border-border px-8 py-3.5 rounded-full font-medium text-base hover:bg-secondary transition-all shadow-sm flex items-center justify-center gap-2"
                onClick={() => navigate('/medicines')}
              >
                <iconify-icon icon="lucide:search"></iconify-icon>
                Search Medicines
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-semibold text-foreground mb-4">Comprehensive Healthcare Tools</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to make informed decisions about your
                medications and health conditions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-all flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <iconify-icon icon="lucide:bot" class="text-3xl"></iconify-icon>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Consultation</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  Have a natural conversation about symptoms, treatments, and general medical inquiries with our trained
                  AI model.
                </p>
                <button onClick={() => navigate('/chat')} className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Try AI Chat <iconify-icon icon="lucide:arrow-right"></iconify-icon>
                </button>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-all flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <iconify-icon icon="lucide:pill" class="text-3xl"></iconify-icon>
                </div>
                <h3 className="text-xl font-semibold mb-3">Medicine Lookup</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  Search a vast database of medications to find dosages, side effects, and detailed descriptions
                  instantly.
                </p>
                <button onClick={() => navigate('/medicines')} className="text-emerald-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Search Database <iconify-icon icon="lucide:arrow-right"></iconify-icon>
                </button>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-all flex flex-col items-start group">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <iconify-icon icon="lucide:shield-alert" class="text-3xl"></iconify-icon>
                </div>
                <h3 className="text-xl font-semibold mb-3">Interaction Checker</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  Input multiple medications to check for potential dangerous interactions and receive safety
                  recommendations.
                </p>
                <button onClick={() => navigate('/app/interactions')} className="text-amber-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Check Interactions <iconify-icon icon="lucide:arrow-right"></iconify-icon>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">Trusted by Healthcare
              Professionals</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale">
              <div className="flex items-center gap-2 font-heading font-bold text-xl"><iconify-icon
                  icon="lucide:cross"></iconify-icon> MedTech</div>
              <div className="flex items-center gap-2 font-heading font-bold text-xl"><iconify-icon
                  icon="lucide:heart-pulse"></iconify-icon> HealthCare+</div>
              <div className="flex items-center gap-2 font-heading font-bold text-xl"><iconify-icon
                  icon="lucide:microscope"></iconify-icon> BioPharma</div>
              <div className="flex items-center gap-2 font-heading font-bold text-xl"><iconify-icon
                  icon="lucide:stethoscope"></iconify-icon> ClinicOS</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
