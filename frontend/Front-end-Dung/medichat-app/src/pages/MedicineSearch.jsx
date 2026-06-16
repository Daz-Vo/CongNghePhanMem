import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const medicines = [
  { id: 1, name: 'Amoxicillin', type: 'Antibiotic (Penicillin)', desc: 'Used to treat a wide variety of bacterial infections. This medication is a penicillin-type antibiotic.', tags: ['Rx Required', 'Oral'], color: 'blue', saved: false },
  { id: 2, name: 'Lisinopril', type: 'ACE Inhibitor', desc: 'Used to treat high blood pressure and heart failure, and to improve survival after a heart attack.', tags: ['Rx Required', 'Oral'], color: 'emerald', saved: true },
  { id: 3, name: 'Ibuprofen', type: 'NSAID', desc: 'Nonsteroidal anti-inflammatory drug used for treating pain, fever, and inflammation.', tags: ['OTC', 'Oral'], color: 'amber', saved: false },
  { id: 4, name: 'Metformin', type: 'Antidiabetic', desc: 'First-line medication for the treatment of type 2 diabetes, particularly in people who are overweight.', tags: ['Rx Required', 'Oral'], color: 'purple', saved: false },
  { id: 5, name: 'Omeprazole', type: 'Proton Pump Inhibitor', desc: 'Used in the treatment of gastroesophageal reflux disease, peptic ulcer disease, and Zollinger–Ellison syndrome.', tags: ['OTC / Rx', 'Oral'], color: 'blue', saved: false },
  { id: 6, name: 'Aspirin', type: 'NSAID / Antiplatelet', desc: 'Used to reduce pain, fever, or inflammation. Also used to prevent blood clots and reduce risk of heart attack.', tags: ['OTC', 'Oral'], color: 'red', saved: false },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
};

const MedicineSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [savedMap, setSavedMap] = useState(
    Object.fromEntries(medicines.map((m) => [m.id, m.saved]))
  );

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.type.toLowerCase().includes(query.toLowerCase())
  );

  const toggleSave = (id) => setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="relative w-full shadow-sm">
          <iconify-icon icon="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl"></iconify-icon>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by medicine name, active ingredient, or condition..."
            className="w-full pl-12 pr-28 py-4 bg-card border border-border rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
            Search
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {['All Categories', 'Prescription (Rx)', 'Over-the-counter (OTC)', 'Sort by: A-Z'].map((label, i) => (
            <button key={i} className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
              {i === 0 && <iconify-icon icon="lucide:filter" class="text-muted-foreground"></iconify-icon>}
              {label}
              {i === 3 && <iconify-icon icon="lucide:chevron-down" class="text-muted-foreground"></iconify-icon>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {filtered.map((med) => (
          <div key={med.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col relative group">
            <button
              onClick={() => toggleSave(med.id)}
              className={`absolute top-4 right-4 transition-colors ${savedMap[med.id] ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
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
      </div>

      <div className="flex items-center justify-center gap-2 mt-auto pb-8">
        <button disabled className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50">
          <iconify-icon icon="lucide:chevron-left"></iconify-icon>
        </button>
        {[1, 2, 3].map((n) => (
          <button key={n} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${n === 1 ? 'bg-primary text-primary-foreground shadow-sm' : 'border border-border text-foreground hover:bg-secondary transition-colors'}`}>
            {n}
          </button>
        ))}
        <span className="text-muted-foreground">...</span>
        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
          <iconify-icon icon="lucide:chevron-right"></iconify-icon>
        </button>
      </div>
    </>
  );
};

export default MedicineSearch;
