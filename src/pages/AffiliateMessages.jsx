import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { MessageSquare, Send, Plus, Inbox, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GlassCard from '@/components/ui/GlassCard';

export default function AffiliateMessages() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState({ subject: '', content: '' });
  const [replyContent, setReplyContent] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AffiliateMessages'));
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
    };
    checkAuth();
  }, []);

  const { data: affiliate } = useQuery({
    queryKey: ['affiliate', user?.email],
    queryFn: async () => {
      const affiliates = await base44.entities.Affiliate.filter({ user_email: user.email });
      return affiliates[0];
    },
    enabled: !!user?.email
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', affiliate?.id],
    queryFn: () => base44.entities.Message.filter({ affiliate_id: affiliate.id }, '-created_date'),
    enabled: !!affiliate?.id
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Message.create({
        affiliate_id: affiliate.id,
        affiliate_email: user.email,
        subject: newMessage.subject,
        content: newMessage.content,
        sender_type: 'affiliate',
        is_read: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', affiliate?.id]);
      setNewMessage({ subject: '', content: '' });
      setDialogOpen(false);
    }
  });

  const sendReplyMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Message.create({
        affiliate_id: affiliate.id,
        affiliate_email: user.email,
        subject: `Re: ${selectedMessage.subject}`,
        content: replyContent,
        sender_type: 'affiliate',
        is_read: false,
        parent_id: selectedMessage.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', affiliate?.id]);
      setReplyContent('');
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId) => {
      await base44.entities.Message.update(messageId, { is_read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', affiliate?.id]);
    }
  });

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    if (!message.is_read && message.sender_type === 'admin') {
      markAsReadMutation.mutate(message.id);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read && m.sender_type === 'admin').length;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <DashboardSidebar onLogout={handleLogout} />
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
          affiliate={affiliate} 
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
                <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
                <p className="text-gray-400">Communicate with your affiliate manager.</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">
                    <Plus className="w-4 h-4 mr-2" />
                    New Message
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white">New Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Input
                      placeholder="Subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Textarea
                      placeholder="Write your message..."
                      value={newMessage.content}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white min-h-[150px]"
                    />
                    <Button
                      onClick={() => sendMessageMutation.mutate()}
                      disabled={!newMessage.subject || !newMessage.content || sendMessageMutation.isPending}
                      className="w-full bg-gradient-to-r from-blue-500 to-emerald-500"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6 min-h-[600px]">
              {/* Message List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1"
              >
                <GlassCard className="h-full overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">Inbox</h3>
                      {unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-[500px]">
                    {messages.length === 0 ? (
                      <div className="p-8 text-center">
                        <Inbox className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No messages yet</p>
                      </div>
                    ) : (
                      messages.filter(m => !m.parent_id).map((message) => (
                        <button
                          key={message.id}
                          onClick={() => handleSelectMessage(message)}
                          className={`w-full p-4 text-left border-b border-white/5 hover:bg-white/5 transition-colors ${
                            selectedMessage?.id === message.id ? 'bg-white/10' : ''
                          } ${!message.is_read && message.sender_type === 'admin' ? 'bg-blue-500/5' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium truncate ${
                                !message.is_read && message.sender_type === 'admin' ? 'text-white' : 'text-gray-300'
                              }`}>
                                {message.subject}
                              </p>
                              <p className="text-gray-500 text-sm truncate mt-1">
                                {message.content}
                              </p>
                            </div>
                            {!message.is_read && message.sender_type === 'admin' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                          <p className="text-gray-500 text-xs mt-2">
                            {format(new Date(message.created_date), 'MMM d, h:mm a')}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Message Detail */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <GlassCard className="h-full flex flex-col">
                  {selectedMessage ? (
                    <>
                      <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-semibold text-white">{selectedMessage.subject}</h2>
                        <p className="text-gray-400 text-sm mt-1">
                          {selectedMessage.sender_type === 'admin' ? 'From: Support Team' : 'From: You'}
                          {' • '}
                          {format(new Date(selectedMessage.created_date), 'MMMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      
                      <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {/* Main message */}
                        <div className={`p-4 rounded-xl ${
                          selectedMessage.sender_type === 'admin' 
                            ? 'bg-blue-500/10 border border-blue-500/20' 
                            : 'bg-white/5 border border-white/10 ml-8'
                        }`}>
                          <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.content}</p>
                        </div>

                        {/* Replies */}
                        {messages
                          .filter(m => m.parent_id === selectedMessage.id)
                          .map((reply) => (
                            <div 
                              key={reply.id}
                              className={`p-4 rounded-xl ${
                                reply.sender_type === 'admin' 
                                  ? 'bg-blue-500/10 border border-blue-500/20' 
                                  : 'bg-white/5 border border-white/10 ml-8'
                              }`}
                            >
                              <p className="text-gray-500 text-xs mb-2">
                                {reply.sender_type === 'admin' ? 'Support Team' : 'You'}
                                {' • '}
                                {format(new Date(reply.created_date), 'MMM d, h:mm a')}
                              </p>
                              <p className="text-gray-300 whitespace-pre-wrap">{reply.content}</p>
                            </div>
                          ))}
                      </div>

                      <div className="p-4 border-t border-white/10">
                        <div className="flex gap-3">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="bg-white/5 border-white/10 text-white min-h-[80px]"
                          />
                          <Button
                            onClick={() => sendReplyMutation.mutate()}
                            disabled={!replyContent || sendReplyMutation.isPending}
                            className="bg-gradient-to-r from-blue-500 to-emerald-500 self-end"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Select a message to view</p>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}