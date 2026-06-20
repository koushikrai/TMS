"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTMSStore, UserRole } from "@/lib/store/tmsStore";
import { Compass, Lock, Mail, Server } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setRole, currentRole } = useTMSStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("SYS_ADMIN");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (currentRole) {
      router.replace("/dashboard");
    }
  }, [currentRole, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setRole(selectedRole);
      setIsLoading(false);
      router.replace("/dashboard");
    }, 800);
  };

  const handleSSO = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRole("SYS_ADMIN");
      setIsLoading(false);
      router.replace("/dashboard");
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-tile-black via-brand-teal to-tile-black p-4 relative overflow-hidden">
      
      {/* Dynamic Background Circles */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-brand-teal opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-brand-blue opacity-10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-[440px] bg-white rounded-apple-lg border border-border-hairline shadow-product overflow-hidden"
      >
        <div className="p-8 sm:p-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-apple-md bg-brand-teal text-white shadow-overlay mb-4">
              <Compass className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h1 className="text-display-md text-ink font-semibold tracking-tight text-center">TMS-365</h1>
            <p className="text-caption text-ink-muted text-center mt-1">CJSC Logistics & Transport Command Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-caption-strong text-ink font-semibold" htmlFor="email">Work Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted pointer-events-none">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@expertise.com.sa"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border-hairline rounded-apple-sm text-caption text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue-focus transition-all placeholder:text-ink-muted/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-caption-strong text-ink font-semibold" htmlFor="password">Password</label>
                <a href="#" className="text-caption text-brand-blue hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted pointer-events-none">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border-hairline rounded-apple-sm text-caption text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue-focus transition-all placeholder:text-ink-muted/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Dev Mode Role Selector */}
            <div className="space-y-1.5 border-t border-border-soft pt-4 mt-2">
              <div className="flex items-center gap-1.5 text-caption-strong text-system-orange font-semibold">
                <Server className="h-4 w-4" />
                <span>Developer RBAC Override</span>
              </div>
              <select
                className="w-full px-3 py-2.5 bg-background border border-border-hairline rounded-apple-sm text-caption text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue-focus transition-all"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              >
                <option value="SYS_ADMIN">System Administrator (SYS_ADMIN)</option>
                <option value="TRANS_ADMIN">Transport Admin (TRANS_ADMIN)</option>
                <option value="FLEET_MGR">Fleet Manager (FLEET_MGR)</option>
                <option value="EXEC">Executive (EXEC)</option>
                <option value="HR_DEPT">HR / Department User (HR_DEPT)</option>
                <option value="FINANCE">Finance Accountant (FINANCE)</option>
                <option value="DRIVER">Driver (DRIVER)</option>
              </select>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 mt-2 bg-brand-teal hover:bg-[#005a5a] text-white text-caption-strong font-semibold rounded-apple-pill btn-press-active shadow-overlay transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* SSO Option */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-soft" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-ink-muted font-medium">Or continue with</span></div>
          </div>

          <button
            type="button"
            onClick={handleSSO}
            disabled={isLoading}
            className="w-full py-2.5 border border-border-hairline bg-background hover:bg-background-secondary text-ink text-caption font-semibold rounded-apple-pill btn-press-active transition-all flex items-center justify-center gap-2"
          >
            Sign in with Company SSO
          </button>
        </div>
      </motion.div>
    </div>
  );
}
