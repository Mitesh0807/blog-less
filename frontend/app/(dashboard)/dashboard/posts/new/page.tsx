'use client';

import { PostForm } from '@/components/post-form';

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Post</h1>
        <p className="text-gray-500">Create a new blog post to share with your audience</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <PostForm />
      </div>
    </div>
  );
}