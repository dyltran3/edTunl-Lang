'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Flame, BookOpen, Trophy, Users, Globe, Shield, User, LogOut, Video, PlusCircle, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, userProfile, isAdmin, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { label: 'Tổng quan', href: '/dashboard', icon: BookOpen, requiresAuth: true },
    { label: 'Khoá học', href: '/languages', icon: Globe },
    { label: 'Thư viện', href: '/library', icon: BookOpen },
    { label: 'Nhóm học', href: '/groups', icon: Users, requiresAuth: true },
    { label: 'Xếp hạng', href: '/ranking', icon: Trophy },
    { label: 'Phòng học', href: '/live-room', icon: Video, badge: 'Sắp ra mắt' },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', href: '/admin', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 text-lg">
                ed
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1">
              edTunl <span className="text-cyan-400 font-extrabold">Lang</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium -mt-1">Nền tảng học ngôn ngữ AI</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            if (item.requiresAuth && !user) return null;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Streak & User Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Daily Streak Counter */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold"
                title="Chuỗi chuyên cần hằng ngày (Streak)"
              >
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{userProfile?.streakCount ?? 0} ngày</span>
              </div>

              {/* Upload CTA */}
              <Link
                href="/upload"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-medium hover:brightness-110 shadow-md shadow-indigo-600/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tạo bài học</span>
              </Link>

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-slate-700/80 hover:border-slate-500 transition-colors"
                >
                  {userProfile?.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-indigo-400/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{userProfile?.displayName}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Trang cá nhân</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Sparkles className="w-4 h-4 text-slate-400" />
                      <span>Cài đặt tài khoản</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-indigo-400 hover:bg-indigo-950/50"
                      >
                        <Shield className="w-4 h-4 text-indigo-400" />
                        <span>Trang Quản trị Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-950/40 text-left mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/register"
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
