'use client';

import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile, updateEmail, updatePassword, User } from 'firebase/auth';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setEmail(currentUser.email || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile. Recent login may be required.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user || !newPassword) {
      setPwdMsg({ type: 'error', text: 'Please enter a new password.' });
      return;
    }
    setIsSavingPassword(true);
    setPwdMsg({ type: '', text: '' });
    try {
      await updatePassword(user, newPassword);
      setPwdMsg({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
    } catch (err: any) {
      setPwdMsg({ type: 'error', text: err.message || 'Failed to update password. You may need to log out and log back in.' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-5 lg:p-6 space-y-6 animate-fade-in bg-[var(--background)] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
            System Settings
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage your account profile and console preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Profile Card */}
        <div className="orbit-card p-6 md:p-8">
          <h2 className="text-sm font-bold text-[var(--foreground)] border-b border-[var(--border-color)] pb-3 mb-6 uppercase tracking-wider">
            Profile Information
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--foreground)] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--primary)] transition text-sm font-medium" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                System Role
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value="Super Administrator" 
                  disabled 
                  className="w-full bg-[var(--hover-bg)] border border-[var(--border-color)] text-[var(--text-muted)] px-4 py-2.5 rounded-lg opacity-70 cursor-not-allowed text-sm font-bold" 
                />
                <ShieldCheck size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--primary)] opacity-50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--foreground)] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--primary)] transition text-sm font-medium" 
              />
            </div>

            {profileMsg.text && (
              <div className={`p-3 rounded-md text-sm font-medium ${profileMsg.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {profileMsg.text}
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-[var(--border-color)] flex justify-end">
            <button 
              onClick={handleSaveProfile}
              disabled={isSavingProfile || !user}
              className="orbit-btn-primary px-6 py-2.5 text-sm font-bold flex items-center gap-2"
            >
              {isSavingProfile ? <Loader2 size={16} className="animate-spin" /> : null}
              {isSavingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Security Card */}
        <div className="orbit-card p-6 md:p-8">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3 mb-6">
            <Key size={16} className="text-[var(--primary)]" />
            <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
              Authentication & Security
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Ensure your account is using a long, random password to stay secure.
              </p>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--foreground)] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--primary)] transition text-sm font-medium" 
                />
              </div>

              {pwdMsg.text && (
                <div className={`p-3 rounded-md text-sm font-medium ${pwdMsg.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {pwdMsg.text}
                </div>
              )}

              <div className="pt-2">
                <button 
                  onClick={handleUpdatePassword}
                  disabled={isSavingPassword || !user || !newPassword}
                  className="orbit-btn-primary px-5 py-2.5 text-sm font-bold bg-[#fb764a] border-[#fb764a] hover:bg-[#e05f35] hover:border-[#e05f35] flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isSavingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>

            <div className="bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-lg p-5 mt-6">
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-2">Two-Factor Authentication</h3>
              <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed mb-5">
                Add an extra layer of security. Once configured, you'll be required to enter both your password and an authentication code from your mobile phone.
              </p>
              <button className="orbit-btn-secondary px-4 py-2.5 text-sm font-bold w-full flex items-center justify-center gap-2">
                <ShieldCheck size={16} />
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
}
