import React from 'react';
import { useNavigate } from 'react-router-dom';

const DiseaseDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full">
      {/* Left Column */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Overview */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">Endocrinology</span>
            <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase flex items-center gap-1">
              <iconify-icon icon="lucide:circle-alert" class="text-base"></iconify-icon> Chronic
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">Type 2 Diabetes Mellitus</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A chronic condition that affects the way your body metabolizes sugar (glucose) — an important source of fuel for your body. With type 2 diabetes, your body either resists the effects of insulin or doesn't produce enough insulin to maintain normal glucose levels.
          </p>
        </section>

        {/* Warning Signs */}
        <section className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 flex gap-4 items-start">
          <div className="bg-destructive text-white p-3 rounded-full flex-shrink-0">
            <iconify-icon icon="lucide:flame" class="text-xl"></iconify-icon>
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-destructive mb-2">Immediate Warning Signs</h3>
            <p className="text-sm text-foreground/80 mb-3">Seek emergency medical care if you experience any of the following:</p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-foreground/90">
              {['Fruity-scented breath', 'Confusion or delirium', 'Nausea and vomiting', 'Shortness of breath'].map(s => (
                <li key={s} className="flex items-center gap-2">
                  <iconify-icon icon="lucide:circle-alert" class="text-destructive flex-shrink-0"></iconify-icon> {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Symptoms */}
        <section className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border">
          <h2 className="text-2xl font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
            <iconify-icon icon="lucide:activity" class="text-primary"></iconify-icon> Common Symptoms
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: 'lucide:droplets', title: 'Increased Thirst & Urination', desc: 'Excess sugar building up in your bloodstream causes fluid to be pulled from tissues.' },
              { icon: 'lucide:battery-warning', title: 'Increased Hunger & Fatigue', desc: 'Without enough insulin to move sugar into cells, your muscles and organs become energy-depleted.' },
              { icon: 'lucide:eye', title: 'Blurred Vision', desc: 'If blood sugar is too high, fluid may be pulled from the lenses of your eyes.' },
              { icon: 'lucide:bandage', title: 'Slow-healing Sores', desc: 'High blood sugar can affect blood flow and cause nerve damage, making healing harder.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                <iconify-icon icon={icon} class="text-primary text-xl mt-0.5 flex-shrink-0"></iconify-icon>
                <div>
                  <h4 className="font-medium text-foreground">{title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Causes & Prevention */}
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <iconify-icon icon="lucide:microscope" class="text-primary"></iconify-icon> Causes
            </h2>
            <ul className="space-y-3 text-muted-foreground text-sm">
              {[
                { label: 'Insulin Resistance', desc: "Muscle, liver and fat cells don't use insulin properly." },
                { label: 'Genetics', desc: 'Family history increases risk significantly.' },
                { label: 'Weight', desc: 'Being overweight is a primary risk factor.' },
                { label: 'Inactivity', desc: 'Less physical activity means higher risk.' },
              ].map(({ label, desc }) => (
                <li key={label} className="flex gap-2">
                  <iconify-icon icon="lucide:check" class="text-primary flex-shrink-0 mt-0.5"></iconify-icon>
                  <span><strong>{label}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <iconify-icon icon="lucide:shield-check" class="text-primary"></iconify-icon> Prevention
            </h2>
            <ul className="space-y-3 text-muted-foreground text-sm">
              {[
                { label: 'Healthy Diet', desc: 'Focus on lower fat, calories and higher fiber.' },
                { label: 'Active Lifestyle', desc: 'Aim for 150 minutes of moderate aerobic activity weekly.' },
                { label: 'Weight Loss', desc: 'Losing 7-10% of body weight can reduce risk.' },
                { label: 'Avoid Inactivity', desc: 'Try not to sit still for long periods.' },
              ].map(({ label, desc }) => (
                <li key={label} className="flex gap-2">
                  <iconify-icon icon="lucide:check" class="text-primary flex-shrink-0 mt-0.5"></iconify-icon>
                  <span><strong>{label}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recommended Medicines</h3>
          <p className="text-xs text-muted-foreground mb-4 pb-4 border-b border-border">Always consult your healthcare provider before starting any medication.</p>
          <div className="space-y-4">
            {[
              { name: 'Metformin', type: 'Biguanides class', icon: 'lucide:pill' },
              { name: 'Glipizide', type: 'Sulfonylureas class', icon: 'lucide:pill' },
              { name: 'Insulin Therapy', type: 'As prescribed', icon: 'lucide:syringe' },
            ].map(({ name, type, icon }) => (
              <div key={name} className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <iconify-icon icon={icon} class="text-xl"></iconify-icon>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-foreground">{name}</h4>
                  <p className="text-xs text-muted-foreground">{type}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/app/medicines')} className="w-full mt-6 text-sm text-primary font-medium hover:underline">
            View full medication list
          </button>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Related Conditions</h3>
          <div className="flex flex-wrap gap-2">
            {['Type 1 Diabetes', 'Prediabetes', 'Hypertension', 'Obesity', 'Neuropathy'].map(c => (
              <button key={c} onClick={() => navigate('/app/diseases')} className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-medium rounded-full transition-colors">
                {c}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Ask AI FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => navigate('/app/chat')} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 rounded-full py-3 px-6 flex items-center gap-3 transition-transform hover:scale-105">
          <iconify-icon icon="lucide:bot" class="text-2xl"></iconify-icon>
          <div className="text-left">
            <div className="text-sm font-bold">Ask AI Assistant</div>
            <div className="text-xs text-primary-foreground/80 font-medium">Get instant medical answers</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DiseaseDetail;
