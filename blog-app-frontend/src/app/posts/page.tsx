// src/app/posts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getPosts, deletePost } from '@/lib/api';
import { Post } from '@/lib/types';

export default function Posts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
        try {
          const response = await getPosts();
          if (response.success && response.data) {
            setPosts(response.data);
          } else {
            alert(response.message || 'Failed to fetch posts');
          }
        } catch (error) {
          alert('An error occurred while fetching posts');
        }
      };
      fetchPosts();
    }
  }, [user]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setDeletingId(id);
      try {
        const response = await deletePost(id);
        if (response.success) {
          alert('Post deleted successfully');
          setPosts(posts.filter((post) => post.id !== id));
        } else {
          alert(response.message || 'Failed to delete post');
        }
      } catch (error) {
        alert('An error occurred while deleting the post');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will handle navigation
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
        <Link
          href="/posts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Post
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts available.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">
                <Link href={`/posts/${post.id}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                By {post.user.name} on{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
              {user.id === post.userId && (
                <div className="mt-4 flex space-x-2">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className={`text-red-600 hover:underline ${
                      deletingId === post.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={deletingId === post.id}
                  >
                    {deletingId === post.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}