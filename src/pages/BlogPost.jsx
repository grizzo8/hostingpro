import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Clock, ArrowLeft, User, Eye, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function BlogPost() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.filter({ slug });
      return posts[0];
    },
    enabled: !!slug
  });

  // Increment view count
  const viewMutation = useMutation({
    mutationFn: async () => {
      if (post) {
        await base44.entities.BlogPost.update(post.id, { views: (post.views || 0) + 1 });
      }
    }
  });

  useEffect(() => {
    if (post && !viewMutation.isSuccess) {
      viewMutation.mutate();
    }
  }, [post?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar user={user} />
        <div className="pt-32 pb-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-[400px] bg-gray-200 rounded-2xl animate-pulse mb-8" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar user={user} />
        <div className="pt-32 pb-24 px-6 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl font-bold text-gray-200 mb-4">404</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Post Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the blog post you're looking for.</p>
            <Link to={createPageUrl('Blog')} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />
      
      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 mb-8 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>

            {post.cover_image && (
              <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              {post.category && (
                <Badge className="bg-red-100 text-red-600 border border-red-200">
                  <Tag className="w-3 h-3 mr-1" />
                  {post.category.replace('-', ' ')}
                </Badge>
              )}
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="border-red-200 text-red-600">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-12 pb-8 border-b border-red-200">
              <div className="flex items-center gap-2">
                {post.author_avatar ? (
                   <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full" />
                 ) : (
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center">
                     <User className="w-5 h-5 text-white" />
                   </div>
                 )}
                <span>{post.author_name || 'HostingPro Team'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : 'Draft'}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.views || 0} views
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-slate-900 mt-12 mb-6" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3" {...props} />,
                  p: ({node, ...props}) => <p className="text-gray-700 mb-6 leading-relaxed" {...props} />,
                  a: ({node, ...props}) => <a className="text-red-600 hover:text-red-700 underline" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-red-600 pl-6 italic text-gray-600 my-8" {...props} />,
                  code: ({node, inline, ...props}) => inline 
                    ? <code className="bg-gray-100 px-2 py-1 rounded text-sm" {...props} />
                    : <code className="block bg-gray-100 p-6 rounded-xl overflow-x-auto text-sm" {...props} />
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </motion.div>
        </div>
      </article>

      <Footer />
    </div>
  );
}