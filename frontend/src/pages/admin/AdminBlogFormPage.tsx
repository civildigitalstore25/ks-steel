import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import type { BlogPost } from '../../types';
import { createBlog, fetchAdminBlog, updateBlog } from '../../services/blogApi';
import { RichTextEditor } from '../../components/RichTextEditor';
import { plainTextFromHtml } from '../../components/RichText';

type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  status: 'draft' | 'published';
  authorName: string;
};

const emptyPost: BlogForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  coverImageAlt: '',
  metaTitle: '',
  metaDescription: '',
  status: 'draft',
  authorName: 'K.S. Steel Corporation'
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export const AdminBlogFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyPost);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchAdminBlog(id)
      .then((post: BlogPost) => {
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage || '',
          coverImageAlt: post.coverImageAlt || '',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          status: post.status,
          authorName: post.authorName || 'K.S. Steel Corporation'
        });
        setSlugEdited(true);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load this post.'))
      .finally(() => setLoading(false));
  }, [id]);

  const setField = (key: keyof BlogForm, value: string) => {
    setForm((current) => {
      const next = { ...current };
      if (key === 'status') next.status = value === 'published' ? 'published' : 'draft';
      else next[key] = value;
      if (key === 'title' && !slugEdited) next.slug = slugify(value);
      if (key === 'slug') next.slug = slugify(value);
      return next;
    });
    if (key === 'slug') setSlugEdited(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status: BlogForm['status'] = submitter?.value === 'published' || submitter?.value === 'draft'
      ? submitter.value
      : form.status;
    const article = plainTextFromHtml(form.content);
    if (form.excerpt.trim().length < 40) {
      setError('Excerpt should be at least 40 characters so search results have a useful description.');
      return;
    }
    if (article.length < 80) {
      setError('Write a longer article in the editor. Aim for a few short paragraphs.');
      return;
    }
    const payload = { ...form, status, content: form.content.trim() };
    setSaving(true);
    setError('');
    try {
      if (isEdit && id) await updateBlog(id, payload);
      else await createBlog(payload);
      navigate('/admin/blogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the post.');
    } finally {
      setSaving(false);
    }
  };

  const searchTitle = form.metaTitle || form.title || 'Post title';
  const searchDescription = form.metaDescription || form.excerpt || 'The excerpt is used as the search description when the meta description is empty.';

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm font-semibold">
        Loading blog post...
      </div>
    );
  }

  const fieldClass = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <Link
          to="/admin/blogs"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#14263D] font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#D7A94B]" />
          <span>Back to Blog Posts</span>
        </Link>
      </div>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#14263D]">
          {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Use the toolbar for headings, lists, alignment, links, images, YouTube, quotes, and color. Save as draft until the article is ready.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#14263D] border-b border-slate-100 pb-2">
            1. Article
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setField('title', e.target.value)} className={fieldClass} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">URL slug *</label>
              <input value={form.slug} onChange={(e) => setField('slug', e.target.value)} className={fieldClass} required />
              <span className="text-[11px] text-slate-500">Public address: /blog/{form.slug || 'your-title'}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">Excerpt * ({form.excerpt.length} characters)</label>
            <textarea value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} rows={3} className={fieldClass} required />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">Article *</label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setField('content', html)}
              placeholder="Write the article. Use headings and lists so it is easy to scan."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">Cover image path</label>
              <input value={form.coverImage} onChange={(e) => setField('coverImage', e.target.value)} placeholder="/images/products/cement-bags.jpg" className={fieldClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">Cover image description</label>
              <input value={form.coverImageAlt} onChange={(e) => setField('coverImageAlt', e.target.value)} className={fieldClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={`${fieldClass} font-semibold`}>
              <option value="draft">Draft — hidden from the website</option>
              <option value="published">Published — visible to visitors</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#14263D] border-b border-slate-100 pb-2">
            2. Search result
          </h3>
          <div>
            <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">Meta title ({(form.metaTitle || form.title).length}/60)</label>
            <input value={form.metaTitle} onChange={(e) => setField('metaTitle', e.target.value)} placeholder={form.title} className={fieldClass} />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">Meta description ({(form.metaDescription || form.excerpt).length}/160)</label>
            <textarea value={form.metaDescription} onChange={(e) => setField('metaDescription', e.target.value)} placeholder={form.excerpt} rows={3} className={fieldClass} />
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-[#1a0dab] text-lg font-medium leading-snug">{searchTitle}</p>
            <p className="text-emerald-700 text-xs mt-1">/blog/{form.slug || 'your-title'}</p>
            <p className="text-slate-600 text-sm mt-1">{searchDescription}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link to="/admin/blogs" className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            value="draft"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save as draft'}
          </button>
          <button
            type="submit"
            value="published"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-extrabold text-sm py-2.5 px-6 rounded-xl shadow transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Publish post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
