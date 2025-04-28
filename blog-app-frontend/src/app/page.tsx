// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will handle navigation
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Welcome to Your Blog, {user.name}!
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-fade-in animation-delay-200">
            Share your stories, connect with readers, and explore new ideas.
          </p>
          <Link
            href="/posts"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-100 transition transform hover:scale-105 animate-fade-in animation-delay-400"
          >
            Explore Posts
          </Link>
        </div>
        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-20 text-white"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Blog With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg shadow-md text-center animate-fade-in animation-delay-600">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Easy to Use
              </h3>
              <p className="text-gray-600">
                Create and manage posts with a simple, intuitive interface.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md text-center animate-fade-in animation-delay-800">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Secure Access
              </h3>
              <p className="text-gray-600">
                Your content is protected with secure login and authentication.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md text-center animate-fade-in animation-delay-1000">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Personalize Your Space
              </h3>
              <p className="text-gray-600">
                Customize your posts and engage with your audience your way.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}