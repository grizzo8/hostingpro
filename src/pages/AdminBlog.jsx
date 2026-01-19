import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { FileText, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GlassCard from '@/components/ui/GlassCard';

const categories = ['tutorials', 'tips', 'news', 'case-studies', 'resources'];

export default function AdminBlog() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: 'tutorials',
    tags: [],
    author_name: '',
    status: 'draft'
  });
  const [newTag, setNewTag] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AdminBlog'));
        return;
      }
      const userData = await base44.auth.me();
      if (userData.role !== 'admin') {
        window.location.href = createPageUrl('AffiliateDashboard');
        return;
      }
      setUser(userData);
      setFormData(prev => ({ ...prev, author_name: userData.full_name }));
    };
    checkAuth();
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date', 100)
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        ...formData,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };
      if (editingPost) {
        await base44.entities.BlogPost.update(editingPost.id, data);
      } else {
        await base44.entities.BlogPost.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-posts']);
      setDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.BlogPost.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-posts']);
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: async (post) => {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      await base44.entities.BlogPost.update(post.id, { 
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-posts']);
    }
  });

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
      category: 'tutorials',
      tags: [],
      author_name: user?.full_name || '',
      status: 'draft'
    });
    setNewTag('');
  };

  const openEditDialog = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image: post.cover_image || '',
      category: post.category || 'tutorials',
      tags: post.tags || [],
      author_name: post.author_name || user?.full_name || '',
      status: post.status || 'draft'
    });
    setDialogOpen(true);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onLogout={handleLogout} />
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader 
          user={user} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
                <p className="text-gray-400">Create and manage blog content.</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {editingPost ? 'Edit Post' : 'Create Post'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Title</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Slug</Label>
                        <Input
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                          placeholder="url-friendly-slug"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Excerpt</Label>
                      <Textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="mt-1 bg-white/5 border-white/10 text-white h-20"
                        placeholder="Brief summary of the post..."
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Content (Markdown supported)</Label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="mt-1 bg-white/5 border-white/10 text-white h-48 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Cover Image URL</Label>
                        <Input
                          value={formData.cover_image}
                          onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10">
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat} className="capitalize">
                                {cat.replace('-', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2 block">Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          className="bg-white/5 border-white/10 text-white"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button onClick={addTag} variant="outline" className="border-white/10 text-white">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            className="bg-white/10 text-gray-300 cursor-pointer hover:bg-rose-500/20 hover:text-rose-400"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Author Name</Label>
                        <Input
                          value={formData.author_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10">
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      {editingPost ? 'Update Post' : 'Create Post'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* Posts List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Post</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Views</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                          </td>
                        </tr>
                      ) : posts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                            <p>No posts yet. Create your first one!</p>
                          </td>
                        </tr>
                      ) : (
                        posts.map((post) => (
                          <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {post.cover_image ? (
                                  <img src={post.cover_image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-white font-medium">{post.title}</p>
                                  <p className="text-gray-400 text-sm">{post.author_name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className="bg-white/10 text-gray-300 capitalize">
                                {post.category?.replace('-', ' ')}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{post.views || 0}</td>
                            <td className="px-6 py-4">
                              <Badge className={`border ${
                                post.status === 'published' 
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}>
                                {post.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                              {format(new Date(post.created_date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => togglePublishMutation.mutate(post)}
                                  className={post.status === 'published' ? 'text-amber-400' : 'text-emerald-400'}
                                >
                                  {post.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(post)} className="text-gray-400 hover:text-white">
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => deleteMutation.mutate(post.id)}
                                  className="text-rose-400 hover:text-rose-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}