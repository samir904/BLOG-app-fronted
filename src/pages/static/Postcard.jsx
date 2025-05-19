import React from 'react';

export default function PostCard({ title, content }) {
  return (
    <div className="bg-[#1e1e1e] p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-gray-300">{content}</p>
    </div>
  );
}