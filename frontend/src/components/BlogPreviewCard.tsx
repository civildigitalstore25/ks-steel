import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../types';

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export const BlogPreviewCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const date = formatDate(post.publishedAt);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-5"
    >
      <div className="mb-3 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:h-52">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-sm font-extrabold text-[#D7A94B]">K.S. Steel</span>
        )}
      </div>
      <span className="w-fit rounded-full bg-[#D7A94B]/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#14263D]">
        Blog
      </span>
      <h3 className="mt-2 line-clamp-2 font-extrabold leading-snug text-[#14263D]">{post.title}</h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-snug text-slate-600">{post.excerpt}</p>
      {date && <p className="mt-3 text-xs font-semibold text-slate-400">{date}</p>}
    </Link>
  );
};
