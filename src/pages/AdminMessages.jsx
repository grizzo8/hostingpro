import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { MessageSquare, Send, Inbox, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GlassCard from '@/components/ui/GlassCard';

export default function AdminMessages() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AdminMessages'));
        return;
      }
      const userData = await base44.auth.me();
      if (userData.role !== 'admin') {
        window.location.href = createPageUrl('AffiliateDashboard');
        return;
      }
      setUser(userData);
    };
    checkAuth();
  }, []);

  const { data: messages = [] } = useQuery({
    queryKey: ['all-messages'],
    queryFn: () => base44.entities.Message.list('-created_date', 200)
  });

  const { data: affiliates = [] } = useQuery({
    queryKey: ['all-affiliates'],
    queryFn: () => base44.entities.Affiliate.list()
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  // Group messages by affiliate
  const conversations = affiliates.map(aff => {
    const affMessages = messages.filter(m => m.affiliate_id === aff.id);
    const unreadCount = affMessages.filter(m => !m.is_read && m.sender_type === 'affiliate').length;
    const lastMessage = affMessages[0];
    return {
      affiliate: aff,
      messages: affMessages,
      unreadCount,
      lastMessage
    };
  }).filter(c => c.messages.length > 0).sort((a, b) => {
    if (!a.lastMessage || !b.lastMessage) return 0;
    return new Date(b.lastMessage.created_date) - new Date(a.lastMessage.created_date);
  });

  const sendReplyMutation = useMutation({
    mutationFn: async () => {
      const parentMessage = selectedConversation.messages.find(m => !m.parent_id);
      await base44.entities.Message.create({
        affiliate_id: selectedConversation.affiliate.id,
        affiliate_email: selectedConversation.affiliate.user_email,
        subject: `Re: ${parentMessage?.subject || 'Support'}`,
        content: replyContent,
        sender_type: 'admin',
        is_read: false,
        parent_id: parentMessage?.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-messages']);
      setReplyContent('');
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageIds) => {
      for (const id of messageIds) {
        await base44.entities.Message.update(id, { is_read: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-messages']);
    }
  });

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    const unreadIds = conv.messages
      .filter(m => !m.is_read && m.sender_type === 'affiliate')
      .map(m => m.id);
    if (unreadIds.length > 0) {
      markAsReadMutation.mutate(unreadIds);
    }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

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
            >
              <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
              <p className="text-gray-400">
                Communicate with affiliates
                {totalUnread > 0 && (
                  <Badge className="ml-2 bg-purple-500 text-white">{totalUnread} unread</Badge>
                )}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6 min-h-[600px]">
              {/* Conversation List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1"
              >
                <GlassCard className="h-full overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Conversations</h3>
                  </div>
                  <div className="overflow-y-auto max-h-[500px]">
                    {conversations.length === 0 ? (
                      <div className="p-8 text-center">
                        <Inbox className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No conversations yet</p>
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <button
                          key={conv.affiliate.id}
                          onClick={() => handleSelectConversation(conv)}
                          className={`w-full p-4 text-left border-b border-white/5 hover:bg-white/5 transition-colors ${
                            selectedConversation?.affiliate.id === conv.affiliate.id ? 'bg-white/10' : ''
                          } ${conv.unreadCount > 0 ? 'bg-purple-500/5' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                                {(conv.affiliate.full_name || conv.affiliate.user_email || 'A').charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className={`font-medium truncate ${conv.unreadCount > 0 ? 'text-white' : 'text-gray-300'}`}>
                                  {conv.affiliate.full_name || conv.affiliate.user_email}
                                </p>
                                <p className="text-gray-500 text-sm truncate">
                                  {conv.lastMessage?.content?.slice(0, 40)}...
                                </p>
                              </div>
                            </div>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-purple-500 text-white flex-shrink-0">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-500 text-xs mt-2">
                            {conv.lastMessage && format(new Date(conv.lastMessage.created_date), 'MMM d, h:mm a')}
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
                  {selectedConversation ? (
                    <>
                      <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {(selectedConversation.affiliate.full_name || selectedConversation.affiliate.user_email || 'A').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-white">
                              {selectedConversation.affiliate.full_name || selectedConversation.affiliate.user_email}
                            </h2>
                            <p className="text-gray-400 text-sm capitalize">
                              {selectedConversation.affiliate.tier} tier • {selectedConversation.affiliate.status}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {selectedConversation.messages
                          .sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
                          .map((message) => (
                            <div 
                              key={message.id}
                              className={`p-4 rounded-xl max-w-[80%] ${
                                message.sender_type === 'admin' 
                                  ? 'bg-purple-500/20 border border-purple-500/30 ml-auto' 
                                  : 'bg-white/5 border border-white/10'
                              }`}
                            >
                              <p className="text-gray-500 text-xs mb-2">
                                {message.sender_type === 'admin' ? 'You' : selectedConversation.affiliate.full_name}
                                {' • '}
                                {format(new Date(message.created_date), 'MMM d, h:mm a')}
                              </p>
                              {message.subject && !message.parent_id && (
                                <p className="text-white font-medium mb-2">{message.subject}</p>
                              )}
                              <p className="text-gray-300 whitespace-pre-wrap">{message.content}</p>
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
                            className="bg-gradient-to-r from-purple-500 to-pink-500 self-end"
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
                        <p className="text-gray-400">Select a conversation to view</p>
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