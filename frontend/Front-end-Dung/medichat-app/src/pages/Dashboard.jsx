import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Welcome back, Alex</h1>
          <p className="text-muted-foreground mt-1 text-sm">Here is your health and search overview for today.</p>
        </div>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
          onClick={() => window.location.href='/app/chat'}
        >
          <iconify-icon icon="lucide:message-circle"></iconify-icon>
          New Consultation
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center">
            <iconify-icon icon="lucide:message-square" class="text-xl"></iconify-icon>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground font-medium">AI Consultations</p>
          </div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <iconify-icon icon="lucide:bookmark" class="text-xl"></iconify-icon>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">8</p>
            <p className="text-xs text-muted-foreground font-medium">Saved Medicines</p>
          </div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <iconify-icon icon="lucide:shield-alert" class="text-xl"></iconify-icon>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground font-medium">Interaction Checks</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-heading font-semibold text-lg">Recent Searches</h2>
              <a href="#" className="text-sm text-primary hover:underline">View All</a>
            </div>
            <div className="divide-y divide-border">
              {/* Item 1 */}
              <div className="px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <iconify-icon icon="lucide:pill"></iconify-icon>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Amoxicillin 500mg</p>
                    <p className="text-xs text-muted-foreground">Medicine Lookup • 2 hours ago</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-primary"><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
              </div>
              {/* Item 2 */}
              <div className="px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <iconify-icon icon="lucide:activity"></iconify-icon>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Hypertension Guidelines</p>
                    <p className="text-xs text-muted-foreground">Disease Lookup • Yesterday</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-primary"><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Medicines */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-semibold text-lg">Saved Medicines</h2>
              <button className="text-muted-foreground hover:text-primary"><iconify-icon icon="lucide:plus"></iconify-icon></button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">Lisinopril</h3>
                  <iconify-icon icon="lucide:bookmark" class="text-primary text-sm"></iconify-icon>
                </div>
                <p className="text-xs text-muted-foreground mb-3">10mg • Once daily</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-secondary text-[10px] font-medium text-muted-foreground">ACE Inhibitor</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors">
              Manage Medicines
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
