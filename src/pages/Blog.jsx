import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import GlassCard from '@/components/ui/GlassCard';

const categoryColors = {
  tutorials: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  tips: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  news: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'case-studies': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  resources: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
};

export default function Blog() {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => base44.entities.BlogPost.filter({ status: 'published' }, '-published_at')
  });

  const categories = ['all', 'tutorials', 'tips', 'news', 'case-studies', 'resources'];
  
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
              Affiliate <span className="text-red-600">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tips, tutorials, and strategies to maximize your affiliate earnings
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat 
                  ? "bg-red-600 text-white border-red-600" 
                  : "border-red-200 text-slate-600 hover:text-red-600 hover:bg-red-50"}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map((i) => (
                <div key={i} className="h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No posts in this category yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link to={createPageUrl(`BlogPost?id=${post.id}`)}>
                    <GlassCard className="overflow-hidden h-full flex flex-col group">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={post.cover_image || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                        {post.category && (
                          <Badge className={`absolute bottom-4 left-4 ${categoryColors[post.category] || 'bg-white/20 text-white'} border`}>
                            <Tag className="w-3 h-3 mr-1" />
                            {post.category.replace('-', ' ')}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-red-600/20">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Draft'}
                          </div>
                          <span className="text-red-600 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                            Read More <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}