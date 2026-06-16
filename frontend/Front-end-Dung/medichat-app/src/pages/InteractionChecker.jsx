import React, { useState } from 'react';

const initialDrugs = ['Lisinopril', 'Ibuprofen', 'Aspirin'];

const interactionResults = [
  {
    severity: 'Major',
    drugs: 'Lisinopril + Ibuprofen',
    severityColor: 'bg-destructive text-primary-foreground',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50/50 border-b-red-100',
    what: 'Using Lisinopril together with Ibuprofen can decrease the effects of Lisinopril in lowering your blood pressure. Additionally, this combination may affect your kidney function.',
    recommendation: 'Talk to your doctor before using these medications together. Alternative pain relievers like Acetaminophen may be safer.',
  },
  {
    severity: 'Moderate',
    drugs: 'Ibuprofen + Aspirin',
    severityColor: 'bg-amber-500 text-white',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50/50 border-b-amber-100',
    what: 'Ibuprofen may interfere with the cardiovascular benefits of low-dose aspirin. Both medications are NSAIDs and taking them together increases the risk of stomach ulcers and bleeding.',
    recommendation: 'If you take aspirin for heart protection, you should take ibuprofen at least 8 hours before or 30 minutes after taking aspirin.',
  },
];

const InteractionChecker = () => {
  const [drugs, setDrugs] = useState(initialDrugs);
  const [inputValue, setInputValue] = useState('');
  const [checked, setChecked] = useState(true);

  const addDrug = () => {
    if (inputValue.trim() && !drugs.includes(inputValue.trim())) {
      setDrugs([...drugs, inputValue.trim()]);
      setInputValue('');
      setChecked(false);
    }
  };

  const removeDrug = (drug) => {
    setDrugs(drugs.filter((d) => d !== drug));
    setChecked(false);
  };

  const handleCheck = () => {
    if (drugs.length >= 2) setChecked(true);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Check Drug Interactions</h1>
        <p className="text-muted-foreground text-sm">Add two or more drugs to your list to check for potential interactions, side effects, and safety recommendations.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-8">
        <label className="block text-sm font-medium text-foreground mb-3">Add Medications</label>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <iconify-icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addDrug()}
              placeholder="Type a drug name (e.g. Aspirin)"
              className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button
            onClick={addDrug}
            className="bg-card text-foreground border border-border px-6 py-3 rounded-xl text-sm font-medium hover:bg-secondary transition-colors whitespace-nowrap shadow-sm"
          >
            Add Drug
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
          {drugs.map((drug) => (
            <div key={drug} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20">
              <iconify-icon icon="lucide:pill" class="text-xs"></iconify-icon>
              {drug}
              <button onClick={() => removeDrug(drug)} className="hover:text-primary/70 ml-1">
                <iconify-icon icon="lucide:x"></iconify-icon>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={drugs.length < 2}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <iconify-icon icon="lucide:shield-alert"></iconify-icon>
          Check Interactions {drugs.length < 2 ? '(add at least 2 drugs)' : ''}
        </button>
      </div>

      {checked && drugs.length >= 2 && (
        <div className="space-y-6">
          <h3 className="font-heading font-semibold text-lg border-b border-border pb-2">Interaction Results</h3>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-destructive flex items-center justify-center flex-shrink-0">
              <iconify-icon icon="lucide:alert-triangle" class="text-2xl"></iconify-icon>
            </div>
            <div className="flex-1">
              <h4 className="text-destructive font-bold text-lg">High Risk Identified</h4>
              <p className="text-sm text-red-900 mt-1">We found 2 interactions between the medications you entered. 1 is major.</p>
            </div>
            <button className="px-4 py-2 bg-card border border-red-200 text-red-700 rounded-full text-sm font-medium hover:bg-red-50 transition-colors shadow-sm">
              Export Report
            </button>
          </div>

          {interactionResults.map((result, i) => (
            <div key={i} className={`bg-card rounded-2xl border shadow-sm overflow-hidden ${result.borderColor}`}>
              <div className={`px-6 py-4 border-b flex items-center justify-between ${result.bgColor}`}>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${result.severityColor}`}>{result.severity}</span>
                  <span className="font-semibold text-foreground">{result.drugs}</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-1">What happens:</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.what}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                    <iconify-icon icon="lucide:info" class="text-primary"></iconify-icon> Recommendations
                  </h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendation}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
              Disclaimer: This information is generalized and not intended as specific medical advice. Always consult your healthcare provider or pharmacist before changing your medication regimen.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default InteractionChecker;
