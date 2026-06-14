import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MedicineDetail = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <nav className="flex text-sm text-muted-foreground font-medium items-center gap-1">
          <button onClick={() => navigate('/app/medicines')} className="hover:text-foreground transition-colors">Medicines</button>
          <span className="mx-1">/</span>
          <span className="text-foreground">Amoxicillin</span>
        </nav>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-card border border-border hover:bg-secondary text-foreground rounded-full text-sm font-medium transition-colors flex items-center">
            <iconify-icon icon="lucide:bookmark" class="mr-2"></iconify-icon>
            Save
          </button>
          <button onClick={() => navigate('/app/chat')} className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-sm font-medium transition-colors flex items-center shadow-sm">
            <iconify-icon icon="lucide:sparkles" class="mr-2"></iconify-icon>
            Ask AI about this
          </button>
        </div>
      </div>

      {/* Header Profile */}
      <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-sm mb-6 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-48 h-48 rounded-xl bg-secondary overflow-hidden flex-shrink-0 border border-border">
          <img src="https://uxmagic.blob.core.windows.net/public/agent-images/med-image-1-1779613274512-hgdx7kpm0oo.png" alt="Medicine Box" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-heading font-bold text-foreground">Amoxicillin</h1>
            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">Prescription Only</span>
          </div>
          <p className="text-lg text-muted-foreground mb-4 font-medium">Amoxil, Trimox, Moxatag</p>
          <p className="text-foreground leading-relaxed mb-6">
            Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of infection caused by bacteria, such as tonsillitis, bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Class', value: 'Penicillin Antibiotic' },
              { label: 'Form', value: 'Capsule, Liquid' },
              { label: 'Route', value: 'Oral' },
              { label: 'Pregnancy', value: 'Category B' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-secondary/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">{label}</p>
                <p className="font-medium text-sm text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ingredients & Dosage */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center">
              <iconify-icon icon="lucide:flask-conical" class="mr-2 text-primary"></iconify-icon>
              Active Ingredients & Dosage
            </h2>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Ingredient</h3>
              <p className="text-foreground">Amoxicillin trihydrate (250mg, 500mg)</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Standard Adult Dosage</h3>
              <div className="bg-secondary/30 rounded-xl p-4 border border-border">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <iconify-icon icon="lucide:check-circle-2" class="text-primary mt-0.5 mr-2 flex-shrink-0"></iconify-icon>
                    <span className="text-sm text-foreground leading-relaxed"><strong>Mild to moderate infections:</strong> 500 mg every 12 hours or 250 mg every 8 hours.</span>
                  </li>
                  <li className="flex items-start">
                    <iconify-icon icon="lucide:check-circle-2" class="text-primary mt-0.5 mr-2 flex-shrink-0"></iconify-icon>
                    <span className="text-sm text-foreground leading-relaxed"><strong>Severe infections:</strong> 875 mg every 12 hours or 500 mg every 8 hours.</span>
                  </li>
                </ul>
                <p className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-start gap-1">
                  <iconify-icon icon="lucide:info" class="mt-0.5 flex-shrink-0"></iconify-icon>
                  Always complete the full course as prescribed, even if symptoms improve.
                </p>
              </div>
            </div>
          </div>

          {/* Side Effects */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center">
              <iconify-icon icon="lucide:activity" class="mr-2 text-primary"></iconify-icon>
              Side Effects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Common (May affect up to 1 in 10)</h3>
                <ul className="space-y-2">
                  {['Nausea or vomiting', 'Diarrhea', 'Skin rash'].map(s => (
                    <li key={s} className="flex items-center text-sm text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2 flex-shrink-0"></span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-600 mb-3">Severe (Seek immediate help)</h3>
                <ul className="space-y-2">
                  {['Severe stomach pain', 'Watery or bloody diarrhea', 'Yellowing of skin or eyes'].map(s => (
                    <li key={s} className="flex items-center text-sm text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-2 flex-shrink-0"></span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Interactions Warning */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
            <h2 className="text-lg font-heading font-semibold text-amber-900 mb-3 flex items-center">
              <iconify-icon icon="lucide:triangle-alert" class="mr-2 text-amber-600"></iconify-icon>
              Drug Interactions
            </h2>
            <p className="text-sm text-amber-800 mb-4 leading-relaxed">
              This medicine has known interactions with <strong>42</strong> other drugs. 3 of these are major interactions.
            </p>
            <div className="space-y-3 mb-4">
              {[
                { drug: 'Methotrexate', severity: 'Major', severityColor: 'bg-red-100 text-red-700', desc: 'Increases toxicity risk.' },
                { drug: 'Warfarin', severity: 'Moderate', severityColor: 'bg-amber-100 text-amber-700', desc: 'May affect bleeding risk.' },
              ].map(({ drug, severity, severityColor, desc }) => (
                <div key={drug} className="bg-white/60 p-3 rounded-xl border border-amber-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{drug}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${severityColor}`}>{severity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/app/interactions')} className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-sm font-medium transition-colors">
              Check all interactions
            </button>
          </div>

          {/* Contraindications */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Contraindications</h2>
            <p className="text-sm text-foreground mb-3 leading-relaxed">Do not use this medicine if you have:</p>
            <ul className="space-y-2">
              {['Allergy to penicillin antibiotics', 'History of amoxicillin-associated jaundice'].map(c => (
                <li key={c} className="flex items-start">
                  <iconify-icon icon="lucide:x" class="text-red-500 mt-0.5 mr-2 flex-shrink-0"></iconify-icon>
                  <span className="text-sm text-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicineDetail;
