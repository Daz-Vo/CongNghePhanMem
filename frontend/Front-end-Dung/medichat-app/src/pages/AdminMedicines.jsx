import React, { useState } from 'react';

const initialMedicines = [
  { id: 1, name: 'Amoxicillin', sub: 'Antibiotic • 500mg Capsule', category: 'Anti-Infective', manufacturer: 'Pfizer Pharmaceuticals', status: 'Prescription', statusColor: 'bg-blue-50 text-blue-700', description: 'Amoxicillin is a penicillin antibiotic used to treat many different types of infection caused by bacteria.', dosage: '500mg every 8 hours', sideEffects: 'Nausea, vomiting, diarrhea, skin rash', contraindications: 'Penicillin allergy, mononucleosis' },
  { id: 2, name: 'Ibuprofen', sub: 'NSAID • 200mg Tablet', category: 'Pain Relief', manufacturer: 'Bayer HealthCare', status: 'Over-the-Counter', statusColor: 'bg-green-50 text-green-700', description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used for fever, pain, or inflammation.', dosage: '200–400mg every 4–6 hours', sideEffects: 'Stomach pain, heartburn, nausea, dizziness', contraindications: 'Kidney disease, peptic ulcer, aspirin allergy' },
  { id: 3, name: 'Lisinopril', sub: 'ACE Inhibitor • 10mg Tablet', category: 'Cardiovascular', manufacturer: 'AstraZeneca', status: 'Prescription', statusColor: 'bg-blue-50 text-blue-700', description: 'Lisinopril is an ACE inhibitor used to treat high blood pressure and heart failure.', dosage: '10mg once daily', sideEffects: 'Dry cough, dizziness, headache, fatigue', contraindications: 'Pregnancy, history of angioedema, renal artery stenosis' },
  { id: 4, name: 'Metformin', sub: 'Biguanide • 500mg ER Tablet', category: 'Endocrine', manufacturer: 'Merck & Co.', status: 'Prescription', statusColor: 'bg-blue-50 text-blue-700', description: 'Metformin is used to manage blood sugar levels in type 2 diabetes mellitus.', dosage: '500mg twice daily with meals', sideEffects: 'Nausea, diarrhea, abdominal discomfort', contraindications: 'Renal impairment, liver disease, alcoholism' },
];

const emptyForm = { name: '', sub: '', category: 'Anti-Infective', manufacturer: '', status: 'Prescription', statusColor: 'bg-blue-50 text-blue-700', description: '', dosage: '', sideEffects: '', contraindications: '' };
const categories = ['Anti-Infective', 'Pain Relief', 'Cardiovascular', 'Endocrine', 'Respiratory', 'Neurological'];
const statuses = [
  { label: 'Prescription', color: 'bg-blue-50 text-blue-700' },
  { label: 'Over-the-Counter', color: 'bg-green-50 text-green-700' },
  { label: 'Controlled Substance', color: 'bg-red-50 text-red-700' },
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

const FormField = ({ label, name, value, onChange, type = 'text', as }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</label>
    {as === 'textarea' ? (
      <textarea name={name} value={value} onChange={onChange} rows={3} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
    )}
  </div>
);

const AdminMedicines = () => {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [modal, setModal] = useState(null); // 'view' | 'edit' | 'add'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [nextId, setNextId] = useState(5);

  const openView = (item) => { setSelected(item); setModal('view'); };
  const openEdit = (item) => { setForm({ ...item }); setModal('edit'); };
  const openAdd = () => { setForm({ ...emptyForm }); setModal('add'); };
  const closeModal = () => setModal(null);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa thuốc này?')) {
      setMedicines(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'status') {
      const s = statuses.find(s => s.label === value);
      setForm(prev => ({ ...prev, status: value, statusColor: s?.color || prev.statusColor }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEdit = () => {
    setMedicines(prev => prev.map(m => m.id === form.id ? { ...form } : m));
    closeModal();
  };

  const handleSaveAdd = () => {
    if (!form.name.trim()) return;
    const s = statuses.find(s => s.label === form.status);
    setMedicines(prev => [...prev, { ...form, id: nextId, statusColor: s?.color || emptyForm.statusColor }]);
    setNextId(n => n + 1);
    closeModal();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-heading font-semibold">Medicine Database</h1>
          <span className="px-2 py-0.5 rounded-md bg-accent text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{medicines.length.toLocaleString()} Drugs</span>
        </div>
        <button onClick={openAdd} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <iconify-icon icon="lucide:plus"></iconify-icon>
          <span>Add New Medicine</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Search & Filter */}
        <div className="bg-card p-4 rounded-xl border border-border flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <iconify-icon icon="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
            <input type="text" placeholder="Search medicines, ingredients, or brand names..." className="w-full pl-11 pr-4 py-2.5 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <select className="px-4 py-2.5 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Categories</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <button className="p-2.5 rounded-full border border-border bg-background hover:bg-accent transition-colors flex items-center gap-2 px-4">
              <iconify-icon icon="lucide:download" class="text-lg"></iconify-icon>
              <span className="text-sm font-medium">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-accent/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Medicine Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Manufacturer</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {medicines.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">No medicines found.</td></tr>
                )}
                {medicines.map((m) => (
                  <tr key={m.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                          <iconify-icon icon="lucide:pill" class="text-xl"></iconify-icon>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{m.name}</span>
                          <span className="text-xs text-muted-foreground">{m.sub}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent text-foreground">{m.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{m.manufacturer}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openView(m)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors" title="Xem chi tiết">
                          <iconify-icon icon="lucide:eye"></iconify-icon>
                        </button>
                        <button onClick={() => openEdit(m)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors" title="Chỉnh sửa">
                          <iconify-icon icon="lucide:pencil"></iconify-icon>
                        </button>
                        <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-destructive transition-colors" title="Xóa">
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
            <span className="text-sm text-muted-foreground">Showing {medicines.length} medicines</span>
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
        <Modal title="Medicine Details" onClose={closeModal}>
          <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <iconify-icon icon="lucide:pill" class="text-2xl"></iconify-icon>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{selected.name}</h3>
              <p className="text-xs text-muted-foreground">{selected.sub}</p>
            </div>
          </div>
          <Field label="Category" value={selected.category} />
          <Field label="Manufacturer" value={selected.manufacturer} />
          <Field label="Description" value={selected.description} />
          <Field label="Dosage" value={selected.dosage} />
          <Field label="Side Effects" value={selected.sideEffects} />
          <Field label="Contraindications" value={selected.contraindications} />
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
        <Modal title="Edit Medicine" onClose={closeModal}>
          <FormField label="Medicine Name" name="name" value={form.name} onChange={handleChange} />
          <FormField label="Sub-description (e.g. Antibiotic • 500mg)" name="sub" value={form.sub} onChange={handleChange} />
          <div className="mb-4">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <FormField label="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} />
          <FormField label="Description" name="description" value={form.description} onChange={handleChange} as="textarea" />
          <FormField label="Dosage" name="dosage" value={form.dosage} onChange={handleChange} />
          <FormField label="Side Effects" name="sideEffects" value={form.sideEffects} onChange={handleChange} as="textarea" />
          <FormField label="Contraindications" name="contraindications" value={form.contraindications} onChange={handleChange} as="textarea" />
          <div className="mt-2 flex justify-end gap-3">
            <button onClick={handleSaveEdit} className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">Save Changes</button>
            <button onClick={closeModal} className="px-5 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          </div>
        </Modal>
      )}

      {/* Add Modal */}
      {modal === 'add' && (
        <Modal title="Add New Medicine" onClose={closeModal}>
          <FormField label="Medicine Name *" name="name" value={form.name} onChange={handleChange} />
          <FormField label="Sub-description (e.g. Antibiotic • 500mg)" name="sub" value={form.sub} onChange={handleChange} />
          <div className="mb-4">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <FormField label="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} />
          <FormField label="Description" name="description" value={form.description} onChange={handleChange} as="textarea" />
          <FormField label="Dosage" name="dosage" value={form.dosage} onChange={handleChange} />
          <FormField label="Side Effects" name="sideEffects" value={form.sideEffects} onChange={handleChange} as="textarea" />
          <FormField label="Contraindications" name="contraindications" value={form.contraindications} onChange={handleChange} as="textarea" />
          <div className="mt-2 flex justify-end gap-3">
            <button onClick={handleSaveAdd} className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">Add Medicine</button>
            <button onClick={closeModal} className="px-5 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminMedicines;
