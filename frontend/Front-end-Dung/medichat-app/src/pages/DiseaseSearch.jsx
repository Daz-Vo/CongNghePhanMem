import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const diseases = [
  { id: 1, name: 'Hypertension', icon: 'lucide:heart-pulse', color: 'bg-blue-50 text-blue-600', risk: 'Moderate Risk', riskColor: 'bg-amber-100 text-amber-700 border-amber-200', desc: 'A condition in which the force of the blood against the artery walls is too high. Usually defined as blood pressure above 140/90.', symptoms: ['Headache', 'Shortness of breath'], category: 'Cardiovascular' },
  { id: 2, name: 'Asthma', icon: 'lucide:wind', color: 'bg-red-50 text-red-600', risk: 'High Risk', riskColor: 'bg-red-100 text-red-700 border-red-200', desc: 'A condition in which a person\'s airways become inflamed, narrow and swell, and produce extra mucus, which makes it difficult to breathe.', symptoms: ['Wheezing', 'Coughing'], category: 'Respiratory' },
  { id: 3, name: 'Common Cold', icon: 'lucide:thermometer', color: 'bg-green-50 text-green-600', risk: 'Low Risk', riskColor: 'bg-green-100 text-green-700 border-green-200', desc: 'A common viral infection of the nose and throat. In contrast to the flu, a common cold can be caused by many different types of viruses.', symptoms: ['Runny nose', 'Sore throat'], category: 'Infectious' },
  { id: 4, name: 'Migraine', icon: 'lucide:brain', color: 'bg-purple-50 text-purple-600', risk: 'Moderate Risk', riskColor: 'bg-amber-100 text-amber-700 border-amber-200', desc: 'A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.', symptoms: ['Throbbing pain', 'Aura'], category: 'Neurological' },
];

const categories = ['All Conditions', 'Cardiovascular', 'Respiratory', 'Neurological', 'Infectious'];

const DiseaseSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Conditions');

  const filtered = diseases.filter((d) => {
    const matchQuery = d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.symptoms.some(s => s.toLowerCase().includes(query.toLowerCase()));
    const matchCat = activeCategory === 'All Conditions' || d.category === activeCategory;
    return matchQuery && matchCat;
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Disease Lookup</h1>
        <p className="text-muted-foreground mb-8">Search for medical conditions, symptoms, and treatment guidelines.</p>

        <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
              <iconify-icon icon="lucide:search" class="text-xl"></iconify-icon>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-background border border-input rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-base"
              placeholder="Search by disease name or symptoms..."
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-shrink-0 px-4 py-3 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center">
              <iconify-icon icon="lucide:filter" class="mr-2"></iconify-icon>
              Filters
            </button>
            <button className="flex-shrink-0 px-4 py-3 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center">
              <iconify-icon icon="lucide:activity" class="mr-2"></iconify-icon>
              By Symptom
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {filtered.map((d) => (
          <div key={d.id} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group">
            <div className="flex justify-between items-start mb-4">
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

export default DiseaseSearch;
