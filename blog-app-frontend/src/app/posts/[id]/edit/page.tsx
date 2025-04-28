// src/app/posts/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getPost, updatePost } from '@/lib/api';
import { Post } from '@/lib/types';

export default function EditPost({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchPost = async () => {
        try {
          const response = await getPost(parseInt(params.id));
          if (response.success && response.data) {
            setPost(response.data);
            setTitle(response.data.title);
            setContent(response.data.content);
          } else {
            alert(response.message || 'Failed to fetch post');
            router.push('/posts');
          }
        } catch (error) {
          alert('An error occurred while fetching the post');
          router.push('/posts');
        }
      };
      fetchPost();
    }
  }, [user, params.id, router]);

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};
    if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }
    if (content.length > 1000) {
      newErrors.content = 'Content must be 1000 characters or less';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !validateForm()) return;
    setUpdating(true);
    try {
      const response = await updatePost(post.id, { title, content });
      if (response.success) {
        alert('Post updated successfully');
        router.push(`/posts/${post.id}`);
      } else {
        alert(response.message || 'Failed to update post');
      }
    } catch (error) {
      alert('An error occurred while updating the post');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || user.id !== post.userId) {
    router.push('/posts');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`mt-1 w-full p-2 border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
            disabled={updating}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`mt-1 w-full p-2 border ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-40`}
            required
            disabled={updating}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 rounded hover:from-blue-700 hover:to-cyan-600 transition ${
            updating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={updating}
        >
          {updating ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}