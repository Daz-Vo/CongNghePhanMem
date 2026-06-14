import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';



const stats = [
  { label: 'Total Users', value: '24,592', icon: 'lucide:users', iconBg: 'bg-blue-50 text-primary', trend: '+12.5%', trendColor: 'text-emerald-600 bg-emerald-50' },
  { label: 'AI Queries Today', value: '8,405', icon: 'lucide:bot', iconBg: 'bg-purple-50 text-purple-600', trend: '+8.2%', trendColor: 'text-emerald-600 bg-emerald-50' },
  { label: 'Medicine Database', value: '12,490', icon: 'lucide:pill', iconBg: 'bg-emerald-50 text-emerald-600', trend: 'Updated', trendColor: 'text-muted-foreground bg-secondary' },
  { label: 'System Errors', value: '14', icon: 'lucide:alert-triangle', iconBg: 'bg-amber-50 text-amber-600', trend: '-2.1%', trendColor: 'text-red-600 bg-red-50' },
];

const activityLog = [
  { icon: 'lucide:database', iconBg: 'bg-blue-50 text-primary', title: 'FDA Database Sync Completed', desc: 'Added 42 new medicine records.', time: '2 hours ago' },
  { icon: 'lucide:alert-circle', iconBg: 'bg-amber-50 text-amber-600', title: 'High API Latency Detected', desc: 'AI response time exceeded 2.5s.', time: '5 hours ago' },
  { icon: 'lucide:user-plus', iconBg: 'bg-emerald-50 text-emerald-600', title: 'New Clinic Onboarded', desc: 'Westside Healthcare joined.', time: 'Yesterday' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const loadChart = async () => {
      if (chartRef.current && window.Chart) {
        if (chartInstance.current) chartInstance.current.destroy();
        chartInstance.current = new window.Chart(chartRef.current, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'AI Queries',
              data: [4200, 5800, 5100, 6200, 7800, 8400, 8100],
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: '#E2E8F0' } },
              x: { grid: { display: false } },
            },
          },
        });
      }
    };
    // Load Chart.js if not already loaded
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = loadChart;
      document.head.appendChild(script);
    } else {
      loadChart();
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">System Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor platform usage, AI performance, and database health.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <iconify-icon icon="lucide:download"></iconify-icon>
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.iconBg}`}>
                <iconify-icon icon={s.icon} class="text-xl"></iconify-icon>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1 ${s.trendColor}`}>{s.trend}</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Chart full-width with legend */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg">AI Usage Trends</h2>
        </div>
        <div className="h-64"><canvas ref={chartRef}></canvas></div>
        {/* Legend / chú thích */}
        <div className="mt-4 flex flex-col xl:flex-row xl:items-center gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
            <span className="w-3 h-3 rounded-full bg-primary inline-block shadow-[0_0_8px_rgba(37,99,235,0.6)]"></span>
            <span className="text-sm font-semibold text-primary">Lượt truy vấn AI theo ngày (AI Queries / Day)</span>
          </div>
          <div className="flex items-center gap-4 ml-auto text-sm text-muted-foreground">
            {[
              { icon: 'lucide:database', text: 'FDA Database Sync Completed', sub: 'Added 42 new medicine records', time: '2h ago', color: 'text-primary' },
              { icon: 'lucide:alert-circle', text: 'High API Latency Detected', sub: 'AI response time exceeded 2.5s', time: '5h ago', color: 'text-amber-500' },
              { icon: 'lucide:user-plus', text: 'New Clinic Onboarded', sub: 'Westside Healthcare joined', time: 'Yesterday', color: 'text-emerald-500' },
            ].map((a) => (
              <div key={a.text} className="flex items-start gap-2 bg-accent/50 rounded-lg px-3 py-2">
                <iconify-icon icon={a.icon} class={`${a.color} text-base mt-0.5 flex-shrink-0`}></iconify-icon>
                <div>
                  <p className="font-medium text-foreground text-xs">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.sub} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
};

export default AdminDashboard;
