// src/app/posts/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getPost, deletePost } from '@/lib/api';
import { Post } from '@/lib/types';

export default function PostPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (post && confirm('Are you sure you want to delete this post?')) {
      setDeleting(true);
      try {
        const response = await deletePost(post.id);
        if (response.success) {
          alert('Post deleted successfully');
          router.push('/posts');
        } else {
          alert(response.message || 'Failed to delete post');
        }
      } catch (error) {
        alert('An error occurred while deleting the post');
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading || !post) {
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
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By {post.user.name} on {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
      </div>
      {user.id === post.userId && (
        <div className="mt-6 flex space-x-4">
          <Link
            href={`/posts/${post.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Edit Post
          </Link>
          <button
            onClick={handleDelete}
            className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition ${
              deleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Post'}
          </button>
        </div>
      )}
    </div>
  );
}