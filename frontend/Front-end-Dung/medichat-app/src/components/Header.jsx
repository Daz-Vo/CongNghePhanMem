import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="h-16 flex-shrink-0 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden text-muted-foreground hover:text-foreground">
          <iconify-icon icon="lucide:menu" class="text-2xl"></iconify-icon>
        </button>
        <div className="relative w-full max-w-md hidden sm:block">
          <iconify-icon icon="lucide:search"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
          <input type="text" placeholder="Search medicines, diseases..."
            className="w-full pl-10 pr-4 py-2 bg-secondary border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/app/settings', { state: { tab: 'account' } })}
          className="flex items-center gap-3 pl-4 border-l border-border text-left hover:opacity-80 transition-opacity"
        >
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User Profile"
            className="w-8 h-8 rounded-full object-cover border border-border" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none text-foreground">Alex Morgan</p>
            <p className="text-xs text-muted-foreground mt-1">Free Plan</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
