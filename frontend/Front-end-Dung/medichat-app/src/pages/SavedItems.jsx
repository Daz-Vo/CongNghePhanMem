import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const savedMedicines = [
  { id: 2, name: 'Lisinopril', type: 'ACE Inhibitor', desc: 'Used to treat high blood pressure and heart failure, and to improve survival after a heart attack.', tags: ['Rx Required', 'Oral'], color: 'emerald' },
  { id: 4, name: 'Metformin', type: 'Antidiabetic', desc: 'First-line medication for the treatment of type 2 diabetes, particularly in people who are overweight.', tags: ['Rx Required', 'Oral'], color: 'purple' },
];

const savedDiseases = [
  { id: 1, name: 'Hypertension', icon: 'lucide:heart-pulse', color: 'bg-blue-50 text-blue-600', risk: 'Moderate Risk', riskColor: 'bg-amber-100 text-amber-700 border-amber-200', desc: 'A condition in which the force of the blood against the artery walls is too high. Usually defined as blood pressure above 140/90.', symptoms: ['Headache', 'Shortness of breath'], category: 'Cardiovascular' },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
};

const SavedItems = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('medicines');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Saved Items</h1>
        <p className="text-muted-foreground mb-8">Access your bookmarked medicines, diseases, and interactions quickly.</p>

        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'medicines' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
          >
            Medicines ({savedMedicines.length})
          </button>
          <button
            onClick={() => setActiveTab('diseases')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'diseases' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
          >
            Diseases ({savedDiseases.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {activeTab === 'medicines' && savedMedicines.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">No saved medicines yet.</p>
          </div>
        )}
        
        {activeTab === 'medicines' && savedMedicines.map((med) => (
          <div key={med.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col relative group">
            <button className="absolute top-4 right-4 transition-colors text-primary hover:text-muted-foreground">
              <iconify-icon icon="lucide:bookmark" class="text-xl"></iconify-icon>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[med.color]}`}>
                <iconify-icon icon="lucide:pill" class="text-2xl"></iconify-icon>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{med.name}</h3>
                <p className="text-xs text-muted-foreground">{med.type}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{med.desc}</p>
            <div className="flex items-center gap-2 mb-4">
              {med.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded bg-secondary text-[10px] font-medium text-foreground">{tag}</span>
              ))}
            </div>
            <button
              onClick={() => navigate(`/app/medicines/${med.id}`)}
              className="w-full py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
            >
              View Details
            </button>
          </div>
        ))}

        {activeTab === 'diseases' && savedDiseases.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">No saved diseases yet.</p>
          </div>
        )}

        {activeTab === 'diseases' && savedDiseases.map((d) => (
          <div key={d.id} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group">
            <button className="absolute top-4 right-4 transition-colors text-primary hover:text-muted-foreground">
              <iconify-icon icon="lucide:bookmark" class="text-xl"></iconify-icon>
            </button>
            <div className="flex justify-between items-start mb-4 pr-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.color}`}>
                <iconify-icon icon={d.icon} class="text-xl"></iconify-icon>
              </div>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${d.riskColor}`}>{d.risk}</span>
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{d.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{d.desc}</p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {d.symptoms.map((s) => (
                <span key={s} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">{s}</span>
              ))}
            </div>
            <button
              onClick={() => navigate(`/app/diseases/${d.id}`)}
              className="w-full py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors mt-auto"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default SavedItems;
