import React, { useState, useEffect } from 'react';
import { Send, User, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CommentWall = ({ eventId, isAdmin }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });
    
    if (data) setComments(data);
    setLoading(false);
  };

  const send = async () => {
    if (!text.trim()) return;
    const author = name.trim() || 'Гость';
    
    const { data, error } = await supabase
      .from('comments')
      .insert([{ 
        event_id: eventId, 
        author, 
        content: text.trim() 
      }])
      .select();

    if (data) {
      setComments([...comments, data[0]]);
      setText('');
      setName('');
    }
  };

  const deleteComment = async (id) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  return (
    <div className="glass" style={{padding:32, marginTop:24}}>
      <div className="section-title">
        <Send size={20} className="section-title-icon"/> Пожелания гостей
      </div>
      
      <div className="comment-list">
        {loading ? (
          <p style={{textAlign:'center', color:'var(--muted)'}}>Загрузка комментариев...</p>
        ) : comments.length === 0 ? (
          <p style={{textAlign:'center', color:'var(--muted)', padding: '20px 0'}}>Пока никто не оставил пожеланий. Будьте первыми!</p>
        ) : comments.map((c) => (
          <div key={c.id} className="comment-item">
            <div className="comment-avatar">{c.author[0]}</div>
            <div className="comment-bubble">
              <div className="comment-meta">
                <span className="comment-author">{c.author}</span>
                <span className="comment-time">
                  {new Date(c.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isAdmin && (
                  <button 
                    onClick={() => deleteComment(c.id)} 
                    style={{marginLeft:'auto', background:'none', border:'none', color:'#ef4444', cursor:'pointer', display:'flex'}}
                  >
                    <Trash2 size={14}/>
                  </button>
                )}
              </div>
              <p className="comment-text">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'flex', gap:10, marginTop: 24}}>
        <input 
          className="input" 
          style={{flex:'0 0 160px'}} 
          placeholder="Ваше имя" 
          value={name} 
          onChange={e=>setName(e.target.value)}
        />
        <input 
          className="input" 
          placeholder="Напишите поздравление..." 
          value={text} 
          onChange={e=>setText(e.target.value)} 
          onKeyDown={e=>e.key==='Enter' && send()}
        />
        <button className="btn btn-primary" onClick={send} style={{padding:'0 20px', flexShrink:0}}>
          <Send size={15}/>
        </button>
      </div>
    </div>
  );
};

export default CommentWall;
