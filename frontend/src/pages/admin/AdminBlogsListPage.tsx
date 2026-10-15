import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Edit, ExternalLink, Newspaper, PlusCircle, RefreshCw, Trash2, XCircle } from 'lucide-react';
import type { BlogPost } from '../../types';
import { deleteBlog, fetchAdminBlogs } from '../../services/blogApi';

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export const AdminBlogsListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setPosts(await fetchAdminBlogs());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm(`Delete “${post.title}”?`)) return;
    try {
      await deleteBlog(post._id);
      setPosts((current) => current.filter((item) => item._id !== post._id));
      setNotice('Blog post deleted.');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14263D]">Blog Posts</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Published blogs appear on the public site with a search title, description, and article page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:text-[#14263D] shadow-sm transition-colors"
            title="Refresh posts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/admin/blogs/new"
            className="inline-flex items-center justify-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-bold text-sm py-2.5 px-5 rounded-xl shadow transition-all transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Blog Post</span>
          </Link>
        </div>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-extrabold border-b border-slate-200">
                <th className="py-3.5 px-6">Post</th>
                <th className="py-3.5 px-4">Published</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">Loading blog posts...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Newspaper className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-600">No blog posts yet</p>
                      <p className="text-xs text-slate-400">Use New Blog Post to write the first blog.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const published = post.status === 'published';
                  return (
                    <tr key={post._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <span className="font-extrabold text-[#14263D] block">{post.title}</span>
                        <span className="text-xs text-slate-400">/blog/{post.slug}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                        {formatDate(post.publishedAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                          {published ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                          {published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right space-x-2">
                        {published && (
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>
                        )}
                        <Link
                          to={`/admin/blogs/edit/${post._id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#14263D] bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-lg transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-lg transition-colors border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
