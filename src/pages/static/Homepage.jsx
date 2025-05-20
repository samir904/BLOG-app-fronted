import React from 'react';
import Homelayout from '../../Layouts/Homelayout';
import { Link } from 'react-router-dom';
import PostCard from './Postcard.jsx'; // Adjust the path based on your folder structure

export default function Homepage() {
  // Mock data simulating posts fetched from the backend
  const posts = [
    { id: 1, title: 'Post 1', content: 'This is the content of the first post.' },
    { id: 2, title: 'Post 2', content: 'This is the content of the second post.' },
    { id: 3, title: 'Post 3', content: 'This is the content of the third post.' },
    { id: 4, title: 'Post 4', content: 'This is the content of the fourth post.' },
    { id: 5, title: 'Post 5', content: 'This is the content of the fifth post.' },
    { id: 6, title: 'Post 6', content: 'This is the content of the sixth post.' },
    { id: 7, title: 'Post 7', content: 'This is the content of the seventh post.' },
    { id: 8, title: 'Post 8', content: 'This is the content of the eighth post.' },
  ];
        

  return (
    <Homelayout>
      <div className="pt-10 pl-10 flex flex-col gap-6 bg-[#121212]">
        <h1 className="text-center text-3xl font-semibold mb-5 text-white">
          All the posts are here
        </h1>
        {/* Map over posts and render PostCard for each */}
        {posts.map((post) => (
          <PostCard key={post.id} title={post.title} content={post.content} />
        ))}
      </div>
    </Homelayout>
  );
}