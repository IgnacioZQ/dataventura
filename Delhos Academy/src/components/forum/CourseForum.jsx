import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Pin, Loader2, Image as ImageIcon, Send, User, Heart, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { api } from '@/api/client';
import { toast } from 'sonner';

export default function CourseForum({ courseId, userEmail, userName, userType }) {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', description: '' });
  const [editingThread, setEditingThread] = useState(null);
  const [editThreadOpen, setEditThreadOpen] = useState(false);

  useEffect(() => {
    loadThreads();
  }, [courseId]);

  useEffect(() => {
    if (selectedThread) {
      loadPosts(selectedThread.id);
      const unsubscribe = api.entities.ForumPost.subscribe((event) => {
        if (event.data.thread_id === selectedThread.id) {
          loadPosts(selectedThread.id);
        }
      });
      return unsubscribe;
    }
  }, [selectedThread]);

  const loadThreads = async () => {
    try {
      const threadsData = await api.entities.ForumThread.filter({ course_id: courseId }, '-created_date');
      setThreads(threadsData);
    } catch (error) {
      console.error('Error loading threads:', error);
    }
    setLoading(false);
  };

  const loadPosts = async (threadId) => {
    try {
      const postsData = await api.entities.ForumPost.filter({ thread_id: threadId }, 'created_date');
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (userType !== 'instructor') {
      toast.error('Solo los instructores pueden crear temas');
      return;
    }

    try {
      await api.entities.ForumThread.create({
        course_id: courseId,
        title: newThread.title,
        description: newThread.description,
        created_by_email: userEmail
      });
      toast.success('Tema creado');
      setNewThread({ title: '', description: '' });
      setNewThreadOpen(false);
      loadThreads();
    } catch (error) {
      toast.error('Error al crear tema');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      await handleSendPost(newPost, file_url);
      setNewPost('');
    } catch (error) {
      toast.error('Error al subir imagen');
    }
    setUploadingImage(false);
  };

  const handleSendPost = async (content, imageUrl = null) => {
    if (!content.trim() && !imageUrl) return;

    try {
      await api.entities.ForumPost.create({
        thread_id: selectedThread.id,
        course_id: courseId,
        author_email: userEmail,
        author_name: userName,
        author_type: userType,
        content: content.trim(),
        image_url: imageUrl,
        likes: []
      });
      setNewPost('');
      loadPosts(selectedThread.id);
    } catch (error) {
      toast.error('Error al enviar mensaje');
    }
  };

  const handleLike = async (post) => {
    try {
      const likes = post.likes || [];
      const hasLiked = likes.includes(userEmail);
      const newLikes = hasLiked 
        ? likes.filter(email => email !== userEmail)
        : [...likes, userEmail];
      
      await api.entities.ForumPost.update(post.id, { likes: newLikes });
      loadPosts(selectedThread.id);
    } catch (error) {
      toast.error('Error al dar like');
    }
  };

  const handleDeleteThread = async (threadId) => {
    if (!confirm('¿Eliminar este tema del foro?')) return;
    try {
      await api.entities.ForumThread.delete(threadId);
      const posts = await api.entities.ForumPost.filter({ thread_id: threadId });
      for (const post of posts) {
        await api.entities.ForumPost.delete(post.id);
      }
      toast.success('Tema eliminado');
      setSelectedThread(null);
      loadThreads();
    } catch (error) {
      toast.error('Error al eliminar tema');
    }
  };

  const handleEditThread = async (e) => {
    e.preventDefault();
    try {
      await api.entities.ForumThread.update(editingThread.id, {
        title: editingThread.title,
        description: editingThread.description
      });
      toast.success('Tema actualizado');
      setEditThreadOpen(false);
      setEditingThread(null);
      if (selectedThread && selectedThread.id === editingThread.id) {
        setSelectedThread({ ...selectedThread, ...editingThread });
      }
      loadThreads();
    } catch (error) {
      toast.error('Error al actualizar tema');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('¿Eliminar este mensaje?')) return;
    try {
      await api.entities.ForumPost.delete(postId);
      toast.success('Mensaje eliminado');
      loadPosts(selectedThread.id);
    } catch (error) {
      toast.error('Error al eliminar mensaje');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  if (selectedThread) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedThread(null)} className="mb-4">
          ← Volver a temas
        </Button>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            {selectedThread.is_pinned && <Pin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1e3a5f]">{selectedThread.title}</h2>
              {selectedThread.description && (
                <p className="text-slate-600 mt-2">{selectedThread.description}</p>
              )}
            </div>
            {userType === 'instructor' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Más opciones">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    setEditingThread(selectedThread);
                    setEditThreadOpen(true);
                  }}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar tema
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteThread(selectedThread.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar tema
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {posts.map((post) => (
              <motion.div 
                key={post.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  post.author_type === 'instructor' ? 'bg-[#EAF2FB] text-[#1E4E86]' : 'bg-blue-100 text-blue-600'
                }`}>
                  {post.author_name.charAt(0)}
                </div>
                <div className="flex-1 bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-700">{post.author_name}</span>
                    {post.author_type === 'instructor' && (
                      <span className="text-xs bg-[#EAF2FB] text-[#1E4E86] px-2 py-0.5 rounded-full">Instructor</span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(post.created_date).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{post.content}</p>
                  {post.image_url && (
                    <motion.img 
                      src={post.image_url} 
                      alt="Adjunto" 
                      className="mt-2 rounded-lg max-w-sm cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    />
                  )}
                  <div className="flex items-center gap-2 mt-2">
                   <button
                     onClick={() => handleLike(post)}
                     className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all ${
                       (post.likes || []).includes(userEmail)
                         ? 'bg-red-100 text-red-600'
                         : 'bg-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-500'
                     }`}
                   >
                     <Heart className={`w-3 h-3 ${(post.likes || []).includes(userEmail) ? 'fill-current' : ''}`} />
                     {(post.likes || []).length}
                   </button>
                   {userType === 'instructor' && (
                     <button
                       onClick={() => handleDeletePost(post.id)}
                       className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                     >
                       <Trash2 className="w-3 h-3" />
                       Eliminar
                     </button>
                   )}
                  </div>
                  </div>
                  </motion.div>
            ))}
          </div>

          <div className="flex gap-2 items-end">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="rounded-xl"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPost(newPost);
                }
              }}
            />
            <div className="flex gap-2">
              <label htmlFor="forum-image-upload">
                <Button type="button" variant="outline" size="icon" aria-label="Adjuntar imagen" disabled={uploadingImage} asChild>
                  <span className="cursor-pointer">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  </span>
                </Button>
                <input
                  id="forum-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <Button size="icon" aria-label="Publicar" onClick={() => handleSendPost(newPost)} disabled={!newPost.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Foro del Curso</h2>
        {userType === 'instructor' && (
          <Dialog open={newThreadOpen} onOpenChange={setNewThreadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2E6DB4] hover:bg-[#2E6DB4] rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Crear tema
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Tema</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateThread} className="space-y-4">
                <Input
                  placeholder="Título del tema"
                  value={newThread.title}
                  onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                  required
                />
                <Textarea
                  placeholder="Descripción (opcional)"
                  value={newThread.description}
                  onChange={(e) => setNewThread({...newThread, description: e.target.value})}
                  rows={3}
                />
                <Button type="submit" className="w-full">Crear tema</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {threads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No hay temas en el foro aún</p>
          {userType === 'instructor' && (
            <p className="text-sm text-slate-400 mt-2">Crea el primer tema para iniciar las discusiones</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((thread, idx) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-[#2E6DB4]/30 transition-all cursor-pointer"
              onClick={() => setSelectedThread(thread)}
            >
              <div className="flex items-start gap-3">
                {thread.is_pinned && <Pin className="w-5 h-5 text-amber-500 flex-shrink-0" />}
                <MessageSquare className="w-5 h-5 text-[#2E6DB4] flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{thread.title}</h3>
                  {thread.description && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{thread.description}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    Creado el {new Date(thread.created_date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Thread Dialog */}
      {editingThread && (
        <Dialog open={editThreadOpen} onOpenChange={setEditThreadOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Tema</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditThread} className="space-y-4">
              <Input
                placeholder="Título del tema"
                value={editingThread.title}
                onChange={(e) => setEditingThread({...editingThread, title: e.target.value})}
                required
              />
              <Textarea
                placeholder="Descripción (opcional)"
                value={editingThread.description}
                onChange={(e) => setEditingThread({...editingThread, description: e.target.value})}
                rows={3}
              />
              <Button type="submit" className="w-full">Guardar cambios</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}