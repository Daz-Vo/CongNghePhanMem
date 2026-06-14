import React, { useState } from 'react';

const initialDiseases = [
  { id: 1, name: 'Type 2 Diabetes Mellitus', sub: 'Chronic metabolic disorder', icd: 'E11.9', category: 'Endocrine', severity: 'Moderate', severityColor: 'bg-amber-50 text-amber-700', icon: 'lucide:activity', iconBg: 'bg-red-50 text-red-600', description: 'A metabolic disease involving abnormally high blood sugar levels, caused by insulin resistance or inadequate insulin secretion.', symptoms: 'Frequent urination, excessive thirst, blurred vision, fatigue, slow healing wounds', treatments: 'Lifestyle changes, Metformin, Insulin therapy, blood sugar monitoring', relatedMedicines: 'Metformin, Insulin Glargine, Sitagliptin' },
  { id: 2, name: 'Acute Bronchitis', sub: 'Inflammation of the bronchial tubes', icd: 'J20.9', category: 'Respiratory', severity: 'Low', severityColor: 'bg-blue-50 text-blue-700', icon: 'lucide:wind', iconBg: 'bg-blue-50 text-blue-600', description: 'Acute bronchitis is inflammation of the lining of bronchial tubes, which carry air to and from the lungs.', symptoms: 'Coughing, mucus production, fatigue, shortness of breath, slight fever', treatments: 'Rest, fluids, cough suppressants, bronchodilators if needed', relatedMedicines: 'Ambroxol, Salbutamol, Dextromethorphan' },
  { id: 3, name: 'Hypertension', sub: 'High blood pressure', icd: 'I10', category: 'Cardiovascular', severity: 'Moderate', severityColor: 'bg-amber-50 text-amber-700', icon: 'lucide:heart', iconBg: 'bg-orange-50 text-orange-600', description: 'Hypertension is a long-term medical condition in which the blood pressure in the arteries is persistently elevated.', symptoms: 'Headache, shortness of breath, nosebleeds, often asymptomatic', treatments: 'ACE inhibitors, calcium channel blockers, diuretics, lifestyle changes', relatedMedicines: 'Lisinopril, Amlodipine, Hydrochlorothiazide' },
  { id: 4, name: "Alzheimer's Disease", sub: 'Progressive neurological disorder', icd: 'G30.9', category: 'Neurological', severity: 'High', severityColor: 'bg-red-50 text-red-700', icon: 'lucide:brain', iconBg: 'bg-purple-50 text-purple-600', description: "Alzheimer's disease is a progressive neurological disorder that causes the brain to shrink and brain cells to die.", symptoms: 'Memory loss, confusion, behavioral changes, difficulty with language', treatments: 'Cholinesterase inhibitors, memantine, supportive care', relatedMedicines: 'Donepezil, Rivastigmine, Memantine' },
];

const emptyForm = { name: '', sub: '', icd: '', category: 'Endocrine', severity: 'Low', severityColor: 'bg-blue-50 text-blue-700', icon: 'lucide:activity', iconBg: 'bg-red-50 text-red-600', description: '', symptoms: '', treatments: '', relatedMedicines: '' };
const categories = ['Endocrine', 'Respiratory', 'Cardiovascular', 'Neurological', 'Digestive', 'Musculoskeletal', 'Infectious'];
const severities = [
  { label: 'Low', color: 'bg-blue-50 text-blue-700' },
  { label: 'Moderate', color: 'bg-amber-50 text-amber-700' },
  { label: 'High', color: 'bg-red-50 text-red-700' },
  { label: 'Critical', color: 'bg-red-100 text-red-800' },
];

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-lg font-heading font-semibold text-foreground">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="py-3 border-b border-border last:border-0">
    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</p>
    <p className="text-sm text-foreground">{value || '—'}</p>
  </div>
);

const FormField = ({ label, name, value, onChange, as }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</label>
    {as === 'textarea' ? (
      <textarea name={name} value={value} onChange={onChange} rows={3} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
    ) : (
      <input name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
    )}
  </div>
);

const AdminDiseases = () => {
  const [diseases, setDiseases] = useState(initialDiseases);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [nextId, setNextId] = useState(5);

  const openView = (item) => { setSelected(item); setModal('view'); };
  const openEdit = (item) => { setForm({ ...item }); setModal('edit'); };
  const openAdd = () => { setForm({ ...emptyForm }); setModal('add'); };
  const closeModal = () => setModal(null);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bệnh này?')) {
      setDiseases(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'severity') {
      const s = severities.find(s => s.label === value);
      setForm(prev => ({ ...prev, severity: value, severityColor: s?.color || prev.severityColor }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEdit = () => {
    setDiseases(prev => prev.map(d => d.id === form.id ? { ...form } : d));
    closeModal();
  };

  const handleSaveAdd = () => {
    if (!form.name.trim()) return;
    const s = severities.find(s => s.label === form.severity);
    setDiseases(prev => [...prev, { ...form, id: nextId, severityColor: s?.color || emptyForm.severityColor }]);
    setNextId(n => n + 1);
    closeModal();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-heading font-semibold">Disease Database</h1>
          <span className="px-2 py-0.5 rounded-md bg-accent text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{diseases.length} Records</span>
        </div>
        <button onClick={openAdd} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <iconify-icon icon="lucide:plus"></iconify-icon>
          <span>Add New Disease</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Search & Filter */}
        <div className="bg-card p-4 rounded-xl border border-border flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <iconify-icon icon="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
            <input type="text" placeholder="Search by disease name, ICD-10 code..." className="w-full pl-11 pr-4 py-2.5 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <select className="px-4 py-2.5 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Systems</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="px-4 py-2.5 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Severity Level</option>
              {severities.map(s => <option key={s.label}>{s.label}</option>)}
            </select>
            <button className="p-2.5 rounded-full border border-border bg-background hover:bg-accent transition-colors">
              <iconify-icon icon="lucide:filter" class="text-lg"></iconify-icon>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-accent/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Disease Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">ICD-10 Code</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {diseases.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">No diseases found.</td></tr>
                )}
                {diseases.map((d) => (
                  <tr key={d.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${d.iconBg}`}>
                          <iconify-icon icon={d.icon} class="text-xl"></iconify-icon>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{d.name}</span>
                          <span className="text-xs text-muted-foreground">{d.sub}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{d.icd}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent text-foreground">{d.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${d.severityColor}`}>{d.severity}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openView(d)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors" title="Xem chi tiết">
                          <iconify-icon icon="lucide:eye"></iconify-icon>
                        </button>
                        <button onClick={() => openEdit(d)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors" title="Chỉnh sửa">
                          <iconify-icon icon="lucide:pencil"></iconify-icon>
                        </button>
                        <button onClick={() => handleDelete(d.id)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-destructive transition-colors" title="Xóa">
                          <iconify-icon icon="lucide:trash-2"></iconify-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-accent/20 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Showing {diseases.length} diseases</span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-border bg-card hover:bg-accent"><iconify-icon icon="lucide:chevron-left"></iconify-icon></button>
              <button className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-medium">1</button>
              <button className="p-2 rounded-lg border border-border bg-card hover:bg-accent"><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {modal === 'view' && selected && (
        <Modal title="Disease Details" onClose={closeModal}>
          <div className={`flex items-center gap-4 mb-6 p-4 rounded-xl ${selected.iconBg.replace('text-', 'bg-').split(' ')[0].replace('bg-', 'bg-') || 'bg-accent'}`} style={{background:'#f1f5f9'}}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected.iconBg}`}>
              <iconify-icon icon={selected.icon} class="text-2xl"></iconify-icon>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{selected.name}</h3>
              <p className="text-xs text-muted-foreground">{selected.sub}</p>
            </div>
            <span className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selected.severityColor}`}>{selected.severity}</span>
          </div>
          <Field label="ICD-10 Code" value={selected.icd} />
          <Field label="Category" value={selected.category} />
          <Field label="Description" value={selected.description} />
          <Field label="Symptoms" value={selected.symptoms} />
          <Field label="Treatments" value={selected.treatments} />
          <Field label="Related Medicines" value={selected.relatedMedicines} />
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => { closeModal(); openEdit(selected); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <iconify-icon icon="lucide:pencil"></iconify-icon> Edit
            </button>
            <button onClick={closeModal} className="px-4 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">Close</button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === 'edit' && (
        <Modal title="Edit Disease" onClose={closeModal}>
          <FormField label="Disease Name *" name="name" value={form.name} onChange={handleChange} />
          <FormField label="Sub-description" name="sub" value={form.sub} onChange={handleChange} />
          <FormField label="ICD-10 Code" name="icd" value={form.icd} onChange={handleChange} />
          <div className="mb-4">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Severity</label>
            <select name="severity" value={form.severity} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
              {severities.map(s => <option key={s.label}>{s.label}</option>)}
            </select>
          </div>
          <FormField label="Description" name="description" value={form.description} onChange={handleChange} as="textarea" />
          <FormField label="Symptoms" name="symptoms" value={form.symptoms} onChange={handleChange} as="textarea" />
          <FormField label="Treatments" name="treatments" value={form.treatments} onChange={handleChange} as="textarea" />
          <FormField label="Related Medicines" name="relatedMedicines" value={form.relatedMedicines} onChange={handleChange} />
          <div className="mt-2 flex justify-end gap-3">
            <button onClick={handleSaveEdit} className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">Save Changes</button>
            <button onClick={closeModal} className="px-5 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          </div>
        </Modal>
      )}

      {/* Add Modal */}
      {modal === 'add' && (
        <Modal title="Add New Disease" onClose={closeModal}>
          <FormField label="Disease Name *" name="name" value={form.name} onChange={handleChange} />
          <FormField label="Sub-description" name="sub" value={form.sub} onChange={handleChange} />
          <FormField label="ICD-10 Code" name="icd" value={form.icd} onChange={handleChange} />
          <div className="mb-4">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Severity</label>
            <select name="severity" value={form.severity} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
              {severities.map(s => <option key={s.label}>{s.label}</option>)}
            </select>
          </div>
          <FormField label="Description" name="description" value={form.description} onChange={handleChange} as="textarea" />
          <FormField label="Symptoms" name="symptoms" value={form.symptoms} onChange={handleChange} as="textarea" />
          <FormField label="Treatments" name="treatments" value={form.treatments} onChange={handleChange} as="textarea" />
          <FormField label="Related Medicines" name="relatedMedicines" value={form.relatedMedicines} onChange={handleChange} />
          <div className="mt-2 flex justify-end gap-3">
            <button onClick={handleSaveAdd} className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">Add Disease</button>
            <button onClick={closeModal} className="px-5 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminDiseases;
