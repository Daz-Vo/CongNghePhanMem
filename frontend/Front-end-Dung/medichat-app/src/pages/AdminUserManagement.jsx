import React, { useState } from 'react';

const initialUsers = [
  { id: 1, initials: 'AJ', bg: 'bg-primary/10 text-primary', name: 'Alex Johnson', email: 'alex.johnson@example.com', role: 'User', status: 'Active', lastLogin: '2 hours ago' },
  { id: 2, initials: 'SM', bg: 'bg-blue-100 text-blue-600', name: 'Sarah Miller', email: 's.miller@mediai.com', role: 'Editor', status: 'Active', lastLogin: '5 mins ago' },
  { id: 3, initials: 'RB', bg: 'bg-red-100 text-red-600', name: 'Robert Brown', email: 'robert.b@provider.net', role: 'User', status: 'Suspended', lastLogin: '3 days ago' },
  { id: 4, initials: 'EL', bg: 'bg-amber-100 text-amber-600', name: 'Emma Lee', email: 'emma.lee@gmail.com', role: 'User', status: 'Inactive', lastLogin: 'Never' },
];

const roleOptions = ['User', 'Editor', 'Administrator'];

const statusStyle = {
  Active: 'text-green-600',
  Suspended: 'text-destructive',
  Inactive: 'text-muted-foreground',
};
const statusDot = {
  Active: 'bg-green-600',
  Suspended: 'bg-destructive',
  Inactive: 'bg-muted-foreground',
};
const roleBadge = {
  User: 'bg-accent text-foreground',
  Editor: 'bg-blue-50 text-blue-700',
  Administrator: 'bg-purple-50 text-purple-700',
};

const AdminUserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const openEdit = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };
  const closeEdit = () => setEditingUser(null);

  const handleSaveRole = () => {
    setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, role: selectedRole } : u));
    closeEdit();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-heading font-semibold">User Management</h1>
          <span className="px-2 py-0.5 rounded-md bg-accent text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {users.length.toLocaleString()} Total Users
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search & Filter */}
        <div className="bg-card p-4 rounded-xl border border-border flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <iconify-icon icon="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
            <input type="text" placeholder="Search by name, email or ID..." className="w-full pl-11 pr-4 py-2.5 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <select className="px-4 py-2.5 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Roles</option>
              {roleOptions.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="px-4 py-2.5 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Active Status</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Inactive</option>
            </select>
            <button className="p-2.5 rounded-full border border-border bg-background hover:bg-accent transition-colors">
              <iconify-icon icon="lucide:sliders-horizontal" class="text-lg"></iconify-icon>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-accent/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">No users found.</td></tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${u.bg}`}>{u.initials}</div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{u.name}</span>
                          <span className="text-xs text-muted-foreground">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadge[u.role] || 'bg-accent text-foreground'}`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${statusStyle[u.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[u.status]}`}></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{u.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                          title="Chỉnh sửa Role"
                        >
                          <iconify-icon icon="lucide:pencil"></iconify-icon>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                          title="Khóa/Mở tài khoản"
                        >
                          <iconify-icon icon={u.status === 'Suspended' ? 'lucide:lock' : 'lucide:lock-open'}></iconify-icon>
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
                          title="Xóa tài khoản"
                        >
                          <iconify-icon icon="lucide:trash-2"></iconify-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-accent/20 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Showing {users.length} users</span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-border bg-card hover:bg-accent disabled:opacity-50" disabled>
                <iconify-icon icon="lucide:chevron-left"></iconify-icon>
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-medium">1</button>
              <button className="p-2 rounded-lg border border-border bg-card hover:bg-accent">
                <iconify-icon icon="lucide:chevron-right"></iconify-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeEdit}>
          <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-heading font-semibold text-foreground">Edit User Role</h2>
              <button onClick={closeEdit} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            <div className="p-6">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-accent/50 rounded-xl">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${editingUser.bg}`}>
                  {editingUser.initials}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{editingUser.name}</p>
                  <p className="text-xs text-muted-foreground">{editingUser.email}</p>
                </div>
              </div>

              {/* Role Select */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Role
                </label>
                <div className="flex flex-col gap-2">
                  {roleOptions.map(role => (
                    <label
                      key={role}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedRole === role
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent/50'
                        }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={selectedRole === role}
                        onChange={() => setSelectedRole(role)}
                        className="accent-primary"
                      />
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${roleBadge[role] || 'bg-accent text-foreground'}`}>{role}</span>
                        <span className="text-xs text-muted-foreground">
                          {role === 'User' && '— Truy cập cơ bản'}
                          {role === 'Editor' && '— Chỉnh sửa nội dung'}
                          {role === 'Administrator' && '— Toàn quyền quản trị'}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleSaveRole}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={closeEdit}
                  className="px-5 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUserManagement;
