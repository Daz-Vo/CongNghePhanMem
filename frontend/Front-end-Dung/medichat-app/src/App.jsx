import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

import PublicLayout from './layouts/PublicLayout';

// Public
import LandingPage from './pages/LandingPage';

// Auth
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// User App
import Dashboard from './pages/Dashboard';
import AiChat from './pages/AiChat';
import MedicineSearch from './pages/MedicineSearch';
import MedicineDetail from './pages/MedicineDetail';
import DiseaseSearch from './pages/DiseaseSearch';
import DiseaseDetail from './pages/DiseaseDetail';
import InteractionChecker from './pages/InteractionChecker';
import Settings from './pages/Settings';
import EditAccount from './pages/EditAccount';
import SavedItems from './pages/SavedItems';

// Admin
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminMedicines from './pages/AdminMedicines';
import AdminDiseases from './pages/AdminDiseases';
import AdminAILogs from './pages/AdminAILogs';
import AdminReports from './pages/AdminReports';

// Placeholder
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
      <iconify-icon icon="lucide:construction" class="text-3xl text-muted-foreground"></iconify-icon>
    </div>
    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes without Auth */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<AiChat />} />
          <Route path="/medicines" element={<MedicineSearch />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* User App Routes */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<AiChat />} />
          <Route path="medicines" element={<MedicineSearch />} />
          <Route path="medicines/:id" element={<MedicineDetail />} />
          <Route path="diseases" element={<DiseaseSearch />} />
          <Route path="diseases/:id" element={<DiseaseDetail />} />
          <Route path="interactions" element={<InteractionChecker />} />
          <Route path="saved" element={<SavedItems />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/edit" element={<EditAccount />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="medicines" element={<AdminMedicines />} />
          <Route path="diseases" element={<AdminDiseases />} />
          <Route path="ai" element={<AdminAILogs />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
