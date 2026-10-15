import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronRight, Clock } from 'lucide-react';
import type { BlogPost } from '../types';
import { fetchPublishedBlog, fetchPublishedBlogs } from '../services/blogApi';
import { Seo } from '../components/Seo';
import { BlogContent } from '../components/BlogContent';
import { RichText } from '../components/RichText';

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function readingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const BlogPostPage: React.FC = () => {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [others, setOthers] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    Promise.all([fetchPublishedBlog(slug), fetchPublishedBlogs()])
      .then(([current, posts]) => {
        setPost(current);
        setOthers(posts.filter((item) => item.slug !== current.slug).slice(0, 6));
        setError('');
      })
      .catch(() => {
        setPost(null);
        setError('This blog post could not be found.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="py-24 text-center text-slate-500 font-semibold">Loading blog...</p>;
  }

  if (!post || error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-[#14263D]">Blog not found</h1>
        <p className="text-slate-500 mt-2">{error}</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 font-bold text-[#14263D]">
          <ArrowLeft className="h-4 w-4 text-[#D7A94B]" />
          Back to blog
        </Link>
      </div>
    );
  }

  const title = post.metaTitle?.trim() || `${post.title} | K.S. Steel Corporation`;
  const description = post.metaDescription?.trim() || post.excerpt;
  const path = `/blog/${post.slug}`;
  const published = post.publishedAt || post.createdAt;

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-16 pt-8">
      <Seo
        title={title}
        description={description}
        path={path}
        image={post.coverImage}
        type="article"
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description,
          image: post.coverImage,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { '@type': 'Organization', name: post.authorName || 'K.S. Steel Corporation' },
          publisher: { '@type': 'Organization', name: 'K.S. Steel Corporation', address: 'Pasupathi Kovil, Tamil Nadu' },
          mainEntityOfPage: path
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#14263D] hover:text-[#0B1728]">
          <ArrowLeft className="h-4 w-4 text-[#D7A94B]" />
          Back to blog
        </Link>

        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          <Link to="/blog" className="font-medium text-slate-500 hover:text-[#14263D]">Blog</Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold text-[#14263D]">Article</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] xl:gap-12">
          <article className="min-w-0">
            {post.coverImage && (
              <figure className="mb-8">
                <div className="aspect-[16/9] max-h-[28rem] overflow-hidden rounded-2xl bg-slate-100 shadow-md ring-1 ring-slate-200">
                  <img
                    src={post.coverImage}
                    alt={post.coverImageAlt || post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </figure>
            )}

            <header className="mb-8 max-w-3xl">
              <span className="inline-block rounded-full bg-[#D7A94B]/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#14263D]">
                Blog
              </span>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#14263D] sm:text-4xl">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 pb-5 text-sm text-slate-500">
                <span className="font-semibold text-[#14263D]">{post.authorName}</span>
                <span aria-hidden>•</span>
                <time dateTime={published || undefined} className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(published)}
                </time>
                <span className="hidden sm:inline" aria-hidden>|</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#D7A94B]" />
                  {readingMinutes(post.content)} min read
                </span>
              </div>
            </header>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {post.excerpt && (
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-6 sm:px-8 sm:py-8">
                  <p className="max-w-3xl border-l-4 border-[#D7A94B] pl-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                    {post.excerpt}
                  </p>
                </div>
              )}
              <div className="px-5 py-6 sm:px-8 sm:py-10">
                {/<\/?[a-z][\s\S]*>/i.test(post.content)
                  ? <RichText html={post.content} className="text-base text-slate-700" />
                  : <BlogContent content={post.content} />}
              </div>
            </div>
          </article>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28 md:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Keep reading</p>
            <h2 className="mt-2 text-base font-extrabold text-[#14263D]">More blogs</h2>
            {others.length > 0 && (
              <ol className="mt-5 space-y-3">
                {others.map((item, index) => (
                  <li key={item._id} className="flex gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D7A94B]/20 text-xs font-bold text-[#14263D]">
                      {index + 1}
                    </span>
                    <Link to={`/blog/${item.slug}`} className="pt-0.5 text-sm font-medium leading-snug text-[#14263D] hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ol>
            )}
            <Link to="/blog" className="mt-4 inline-block text-xs font-semibold text-slate-500 hover:text-[#14263D]">
              View all blogs →
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};
