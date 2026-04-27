import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { Wand2 } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { createEvent, loading } = useEvents();
  const [form, setForm] = useState({ title:'', type:'wedding', date:'', location:'', description:'' });
  const set = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await createEvent(form);
    if (data) navigate('/dashboard');
  };

  const themes = [
    { value:'wedding', emoji:'💍', label:'Свадьба', desc:'Нежный розовый стиль' },
    { value:'birthday', emoji:'🎂', label:'День рождения', desc:'Тёплые золотые тона' },
    { value:'party', emoji:'🎉', label:'Вечеринка', desc:'Неоновый ночной стиль' },
  ];

  return (
    <div className="auth-page" style={{alignItems:'flex-start', paddingTop:60}}>
      <div style={{width:'100%', maxWidth:640, margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:40}}>
          <span className="badge" style={{marginBottom:14}}>Новое событие</span>
          <h2 style={{fontSize:'2rem', fontWeight:900}}>Конструктор праздника</h2>
          <p style={{color:'var(--muted)', marginTop:8}}>Заполните детали — и получите персональную страницу с кодом доступа</p>
        </div>
        <form onSubmit={handleSubmit} className="glass" style={{padding:'40px 36px'}}>

          {/* Type selector */}
          <div style={{marginBottom:28}}>
            <div className="form-label" style={{marginBottom:12}}>Тип события</div>
            <div className="type-grid" style={{display:'grid', gap:12}}>
              {themes.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm(f=>({...f, type:t.value}))}
                  style={{
                    padding:'16px 12px',
                    borderRadius:14,
                    border: form.type === t.value ? '2px solid var(--accent)' : '2px solid var(--border)',
                    background: form.type === t.value ? 'rgba(108,99,255,0.12)' : 'var(--surface)',
                    cursor:'pointer',
                    textAlign:'center',
                    transition:'all 0.2s',
                    color:'var(--text)',
                    boxShadow: form.type === t.value ? '0 0 0 4px var(--glow)' : 'none',
                  }}
                >
                  <div style={{fontSize:'1.8rem', marginBottom:6}}>{t.emoji}</div>
                  <div style={{fontWeight:700, fontSize:'0.9rem'}}>{t.label}</div>
                  <div style={{color:'var(--muted)', fontSize:'0.75rem', marginTop:3}}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">Название события</label>
              <input required className="input" placeholder="Напр: Свадьба Айдара и Алии" value={form.title} onChange={set('title')}/>
            </div>
            <div className="form-group">
              <label className="form-label">Дата</label>
              <input required type="date" className="input" value={form.date} onChange={set('date')}/>
            </div>
            <div className="form-group">
              <label className="form-label">Место</label>
              <input required className="input" placeholder="Grand Hall, Алматы" value={form.location} onChange={set('location')}/>
            </div>
            <div className="form-group full">
              <label className="form-label">Описание</label>
              <textarea className="input" rows={3} placeholder="Расскажите немного о вашем событии..." value={form.description} onChange={set('description')} style={{resize:'vertical'}}/>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{width:'100%', justifyContent:'center', marginTop:28, padding:'16px', fontSize:'1rem'}}>
            <Wand2 size={18}/> {loading ? 'Создаётся...' : 'Создать событие и получить код'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
