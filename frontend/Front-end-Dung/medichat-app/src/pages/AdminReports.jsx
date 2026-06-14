import React, { useEffect, useRef } from 'react';

const AdminReports = () => {
  const activityChartRef = useRef(null);
  const topicsChartRef = useRef(null);
  const medicineChartRef = useRef(null);
  const chartsRef = useRef([]);

  useEffect(() => {
    const loadCharts = () => {
      if (!window.Chart) return;

      chartsRef.current.forEach(c => c && c.destroy());
      chartsRef.current = [];

      if (activityChartRef.current) {
        chartsRef.current.push(new window.Chart(activityChartRef.current, {
          type: 'line',
          data: {
            labels: ['1', '5', '10', '15', '20', '25', '30'],
            datasets: [{ label: 'Consultations', data: [1200, 1900, 1500, 2200, 1800, 2800, 3100], borderColor: '#2563eb', backgroundColor: '#2563eb20', borderWidth: 2, tension: 0.4, fill: true, pointBackgroundColor: '#fff', pointBorderColor: '#2563eb', pointRadius: 4 }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } }, x: { grid: { display: false }, ticks: { color: '#64748b' } } } }
        }));
      }
      if (topicsChartRef.current) {
        chartsRef.current.push(new window.Chart(topicsChartRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Medicines', 'Diseases', 'Drug Interactions', 'Symptoms'],
            datasets: [{ data: [40, 28, 18, 14], backgroundColor: ['#2563eb', '#38bdf8', '#8b5cf6', '#10b981'], borderWidth: 0, cutout: '75%' }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        }));
      }
      if (medicineChartRef.current) {
        chartsRef.current.push(new window.Chart(medicineChartRef.current, {
          type: 'bar',
          data: { labels: ['Metformin', 'Lisinopril', 'Levothyroxine', 'Amlodipine', 'Omeprazole'], datasets: [{ label: 'Searches', data: [8500, 6200, 5800, 4100, 3900], backgroundColor: '#38bdf8', borderRadius: 4 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } }, x: { grid: { display: false }, ticks: { color: '#64748b' } } } }
        }));
      }
    };

    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = loadCharts;
      document.head.appendChild(script);
    } else {
      loadCharts();
    }

    return () => { chartsRef.current.forEach(c => c && c.destroy()); };
  }, []);

  const stats = [
    { label: 'Total Consultations', value: '124,592', icon: 'lucide:message-square', iconBg: 'bg-primary/10 text-primary', trend: '+12.5%' },
    { label: 'Avg Response Time', value: '1.2s', icon: 'lucide:clock', iconBg: 'bg-accent text-primary', trend: '-0.3s' },
    { label: 'AI Accuracy Rate', value: '98.4%', icon: 'lucide:check-circle', iconBg: 'bg-primary/10 text-primary', trend: '+1.1%' },
  ];

  const activityLogs = [
    { icon: 'lucide:file-text', event: 'Generated Report', user: 'Dr. Sarah Jenkins', time: '2 mins ago', status: 'Success', statusColor: 'bg-blue-100 text-blue-600' },
    { icon: 'lucide:alert-triangle', event: 'High Risk Query Flagged', user: 'System AI', time: '15 mins ago', status: 'Review Needed', statusColor: 'bg-destructive/10 text-destructive' },
    { icon: 'lucide:settings', event: 'Model Params Updated', user: 'Admin (ID: 882)', time: '1 hour ago', status: 'Success', statusColor: 'bg-blue-100 text-blue-600' },
    { icon: 'lucide:user-plus', event: 'New Patient Registration', user: 'Patient Portal', time: '3 hours ago', status: 'Success', statusColor: 'bg-blue-100 text-blue-600' },
    { icon: 'lucide:database', event: 'Database Backup', user: 'System Cron', time: '5 hours ago', status: 'Success', statusColor: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl font-heading font-semibold text-foreground">Reports & Statistics</h1>
        <div className="flex items-center gap-4">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
            <iconify-icon icon="lucide:download"></iconify-icon> Export Report
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">{s.value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${s.iconBg}`}>
                  <iconify-icon icon={s.icon} class="text-xl"></iconify-icon>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-blue-400 font-medium flex items-center">
                  <iconify-icon icon="lucide:trending-up" class="mr-1"></iconify-icon>{s.trend}
                </span>
                <span className="text-muted-foreground ml-2">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">User Activity (30 Days)</h3>
              <select className="bg-muted border-none text-xs rounded-md px-2 py-1 focus:ring-0 text-foreground cursor-pointer outline-none">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64 w-full"><canvas ref={activityChartRef}></canvas></div>
            <div className="mt-4 flex items-center justify-center gap-6 border-t border-border pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                <span>Total Consultations (Lượt tư vấn)</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-foreground mb-4">Consultation Topics</h3>
            <div className="h-48 w-full relative flex items-center justify-center">
              <canvas ref={topicsChartRef}></canvas>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-2xl font-bold text-foreground">124k</span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { color: 'bg-primary', label: 'Medicines (Thuốc)', pct: '40%' },
                { color: 'bg-blue-400', label: 'Diseases (Bệnh)', pct: '28%' },
                { color: 'bg-violet-500', label: 'Drug Interactions (Tương tác thuốc)', pct: '18%' },
                { color: 'bg-emerald-500', label: 'Symptoms (Triệu chứng)', pct: '14%' },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${t.color}`}></span>
                    <span className="text-muted-foreground">{t.label}</span>
                  </div>
                  <span className="font-medium text-foreground">{t.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Medicine Chart & Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-foreground mb-4">Top Searched Medicines</h3>
            <div className="h-64 w-full"><canvas ref={medicineChartRef}></canvas></div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Recent Activity Logs</h3>
              <button className="text-sm text-primary hover:underline font-medium">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Event</th>
                    <th className="px-5 py-3 font-medium">User/System</th>
                    <th className="px-5 py-3 font-medium">Time</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {activityLogs.map((log) => (
                    <tr key={log.event + log.time} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <iconify-icon icon={log.icon} class="text-muted-foreground"></iconify-icon>
                          {log.event}
                        </div>
                      </td>
                      <td className="px-5 py-3">{log.user}</td>
                      <td className="px-5 py-3 text-muted-foreground">{log.time}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.statusColor}`}>{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReports;
