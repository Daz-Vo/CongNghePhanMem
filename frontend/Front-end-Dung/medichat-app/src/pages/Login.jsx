import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Giả lập login thành công
    navigate('/app');
  };

  return (
    <>
      <div className="flex items-center justify-center mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mr-3">
          <iconify-icon icon="lucide:activity" class="text-2xl"></iconify-icon>
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">MediChat AI</h1>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-xl font-heading font-semibold text-foreground">Welcome back</h2>
        <p className="text-muted-foreground mt-2 text-sm">Please enter your details to sign in.</p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 ml-4">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
               <iconify-icon icon="lucide:mail"></iconify-icon>
            </div>
            <input type="email" required className="w-full pl-11 pr-4 py-3 bg-background border border-input rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" placeholder="name@example.com" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 ml-4">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
               <iconify-icon icon="lucide:lock"></iconify-icon>
            </div>
            <input type="password" required className="w-full pl-11 pr-4 py-3 bg-background border border-input rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" placeholder="••••••••" />
          </div>
          <div className="mt-1 text-right">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline transition-colors mr-2">Forgot Password?</Link>
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full shadow-sm transition-colors flex items-center justify-center">
            Sign In
            <iconify-icon icon="lucide:arrow-right" class="ml-2"></iconify-icon>
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
      </div>
    </>
  );
};

export default Login;
