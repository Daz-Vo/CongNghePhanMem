import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'general');
  const [theme, setTheme] = useState('Light');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [accountData, setAccountData] = useState({ name: 'Alex Morgan', email: 'alex.morgan@email.com' });

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-3xl bg-card rounded-2xl shadow-sm border border-border flex overflow-hidden min-h-[550px]">
        {/* Left Sidebar */}
        <aside className="w-60 border-r border-border p-6 flex flex-col gap-6 bg-card flex-shrink-0">
          <div className="flex items-center gap-3 text-foreground">
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <iconify-icon icon="lucide:arrow-left" class="text-xl"></iconify-icon>
            </button>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center px-4 py-3 rounded-full font-medium text-sm transition-all ${activeTab === 'general' ? 'bg-background shadow-sm border border-border/50 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center px-4 py-3 rounded-full font-medium text-sm transition-all ${activeTab === 'account' ? 'bg-background shadow-sm border border-border/50 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              Account
            </button>
          </nav>
        </aside>

        {/* Right Content */}
        <main className="flex-1 p-8 flex flex-col">
          {activeTab === 'general' && (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-8">General</h2>
              <div className="flex items-center justify-between py-4">
                <label className="text-sm font-medium text-foreground">Theme</label>
                <div className="flex items-center bg-muted p-1 rounded-xl">
                  {['Light', 'Dark'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${theme === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

            </>
          )}

          {activeTab === 'account' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Account</h2>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-muted hover:bg-white hover:shadow-sm hover:-translate-y-0.5 text-foreground text-sm font-medium rounded-full transition-all duration-200"
                  >
                    Edit Account
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-border text-foreground text-sm font-medium rounded-full hover:bg-muted transition-colors">Cancel</button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors">Save</button>
                  </div>
                )}
              </div>
              <div className="mb-8 flex items-center gap-6">
                <div className="relative group">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile Avatar" className="w-20 h-20 rounded-full object-cover border border-border shadow-sm" />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <iconify-icon icon="lucide:camera" class="text-white text-xl"></iconify-icon>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div>
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors border border-border">
                      Change Picture
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="py-4">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Name</p>
                  {isEditing ? (
                    <input type="text" value={accountData.name} onChange={e => setAccountData({...accountData, name: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                  ) : (
                    <p className="text-base text-foreground font-medium">{accountData.name}</p>
                  )}
                </div>
                <div className="h-px w-full bg-border"></div>
                <div className="py-4">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Email</p>
                  {isEditing ? (
                    <input type="email" value={accountData.email} onChange={e => setAccountData({...accountData, email: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                  ) : (
                    <p className="text-base text-foreground font-medium">{accountData.email}</p>
                  )}
                </div>
                <div className="h-px w-full bg-border"></div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-8 max-w-sm w-full border border-border shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-destructive flex items-center justify-center mx-auto mb-4">
              <iconify-icon icon="lucide:trash-2" class="text-2xl"></iconify-icon>
            </div>
            <h3 className="text-lg font-bold text-foreground text-center mb-2">Delete Account</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 border border-border text-foreground rounded-full text-sm font-medium hover:bg-secondary transition-colors">
                Cancel
              </button>
              <button className="flex-1 py-2.5 bg-destructive text-white rounded-full text-sm font-medium hover:bg-destructive/90 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
