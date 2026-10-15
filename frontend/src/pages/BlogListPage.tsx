import React, { useEffect, useState } from 'react';
import type { BlogPost } from '../types';
import { fetchPublishedBlogs } from '../services/blogApi';
import { Seo } from '../components/Seo';
import { BlogPreviewCard } from '../components/BlogPreviewCard';

export const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublishedBlogs()
      .then(setPosts)
      .catch(() => setError('Blog posts could not be loaded. Please try again in a moment.'))
      .finally(() => setLoading(false));
  }, []);

  const description = 'Blog posts on TMT bars, cement, paints, pipes and building materials from K.S. Steel Corporation in Pasupathi Kovil, Tamil Nadu.';

  return (
    <div className="bg-[#F5F6F8] min-h-screen pb-16">
      <Seo
        title="Blog | K.S. Steel Corporation"
        description={description}
        path="/blog"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'K.S. Steel Corporation Blog',
          description,
          url: typeof window !== 'undefined' ? `${window.location.origin}/blog` : '/blog',
          blogPost: posts.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            url: `/blog/${post.slug}`,
            datePublished: post.publishedAt
          }))
        }}
      />

      <section className="bg-[#14263D] text-white pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#D7A94B] font-extrabold text-[11px] uppercase tracking-[0.18em]">Blog</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">Building material blog</h1>
          <p className="text-slate-300 mt-3 max-w-2xl leading-relaxed">{description}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {loading ? (
          <p className="text-slate-500 font-semibold text-sm py-16 text-center">Loading blogs...</p>
        ) : error ? (
          <p className="bg-white rounded-2xl border border-slate-200 p-8 text-slate-600">{error}</p>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <h2 className="text-xl font-extrabold text-[#14263D]">Blog posts are on the way</h2>
            <p className="text-slate-500 mt-2">New articles from the Pasupathi Kovil store will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <BlogPreviewCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
