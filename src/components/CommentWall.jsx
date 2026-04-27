import React, { useState } from 'react';
import { Send, User, Trash2 } from 'lucide-react';

const CommentWall = ({ comments: initial = [], isAdmin }) => {
  const [comments, setComments] = useState(initial.length ? initial : [
    { author:'Айгерим', time:'Вчера', text:'Поздравляем! Желаем счастья и любви! 💕' },
    { author:'Данияр', time:'2 ч. назад', text:'Ребята, мы так рады за вас! До встречи!' },
  ]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setComments(c => [...c, { author: name || 'Гость', time: 'Только что', text }]);
    setText(''); setName('');
  };

  return (
    <div className="glass" style={{padding:32, marginTop:24}}>
      <div className="section-title">
        <Send size={20} className="section-title-icon"/> Пожелания гостей
      </div>
      <div className="comment-list">
        {comments.map((c,i) => (
          <div key={i} className="comment-item">
            <div className="comment-avatar">{c.author[0]}</div>
            <div className="comment-bubble">
              <div className="comment-meta">
                <span className="comment-author">{c.author}</span>
                <span className="comment-time">{c.time}</span>
                {isAdmin && <button onClick={()=>setComments(cs=>cs.filter((_,j)=>j!==i))} style={{marginLeft:'auto',background:'none',border:'none',color:'#ef4444',cursor:'pointer',display:'flex'}}><Trash2 size={14}/></button>}
              </div>
              <p className="comment-text">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:'flex', gap:10, marginBottom:10}}>
        <input className="input" style={{flex:'0 0 160px'}} placeholder="Ваше имя" value={name} onChange={e=>setName(e.target.value)}/>
        <input className="input" placeholder="Напишите поздравление..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/>
        <button className="btn btn-primary" onClick={send} style={{padding:'0 20px',flexShrink:0}}>
          <Send size={15}/>
        </button>
      </div>
    </div>
  );
};
export default CommentWall;
