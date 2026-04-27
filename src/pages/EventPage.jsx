import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { MapPin, Calendar, Clock, Check, X, Info, Share2, Users, MessageSquare } from 'lucide-react';
import CommentWall from '../components/CommentWall';
import Gallery from '../components/Gallery';

const typeLabel = { wedding: 'Свадьба', birthday: 'День рождения', party: 'Вечеринка' };
const typeEmoji = { wedding: '💍', birthday: '🎂', party: '🎉' };

const EventPage = () => {
  const { code } = useParams();
  const { getEventByCode } = useEvents();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [locked, setLocked] = useState(true);
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  
  const [rsvp, setRsvp] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [rsvpSent, setRsvpSent] = useState(false);
  const [stats, setStats] = useState({ yes: 0, no: 0, maybe: 0 });
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const e = await getEventByCode(code?.toUpperCase());
      setEvent(e || null);
      
      if (e) {
        // Auto-unlock for owner
        if (user && e.user_id === user.id) {
          setLocked(false);
          fetchManagementData(e.id);
        }
        fetchStats(e.id);
      }
      setLoading(false);
    };
    if (code) fetchEvent();
  }, [code, user]);

  const fetchStats = async (eventId) => {
    const { data, error } = await supabase
      .from('guests')
      .select('status')
      .eq('event_id', eventId);
    
    if (data) {
      const newStats = { yes: 0, no: 0, maybe: 0 };
      data.forEach(g => newStats[g.status]++);
      setStats(newStats);
    }
  };

  const fetchManagementData = async (eventId) => {
    const { data } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    if (data) setGuests(data);
  };

  const unlock = () => {
    if (inputCode.toUpperCase() === event?.code) {
      setLocked(false);
      setError('');
    } else {
      setError('Неверный код доступа.');
      setInputCode('');
    }
  };

  const sendRsvp = async () => {
    if (!guestName.trim() || !rsvp) return;
    
    const { error } = await supabase
      .from('guests')
      .insert([{
        event_id: event.id,
        name: guestName.trim(),
        status: rsvp
      }]);

    if (!error) {
      setRsvpSent(true);
      fetchStats(event.id);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Ссылка для гостей скопирована!');
  };

  if (loading) return <div className="auth-page">Загрузка события...</div>;

  if (!event) return (
    <div className="auth-page">
      <div className="glass" style={{padding: 40, textAlign: 'center'}}>
        <div style={{fontSize: '4rem', marginBottom: 20}}>🔍</div>
        <h2>Событие не найдено</h2>
        <p style={{color: 'var(--muted)', marginBottom: 24}}>Проверьте правильность кода в ссылке.</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>На главную</button>
      </div>
    </div>
  );

  if (locked) return (
    <div className="lock-screen">
      <div className="lock-card glass">
        <span className="lock-icon">{typeEmoji[event.type]}</span>
        <h2>Закрытое мероприятие</h2>
        <p>Введите секретный код из приглашения</p>
        <input
          className="input code-input"
          maxLength={6}
          placeholder="XXXXXX"
          value={inputCode}
          onChange={e => setInputCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && unlock()}
          autoFocus
        />
        {error && <p style={{color: '#ef4444', fontSize: '0.88rem', marginBottom: 12}}>{error}</p>}
        <button className="btn btn-primary" style={{width:'100%', justifyContent:'center'}} onClick={unlock}>
          Открыть ✨
        </button>
      </div>
    </div>
  );

  const isOwner = user && event.user_id === user.id;

  return (
    <div data-theme={event.type} style={{minHeight: '100vh', paddingBottom: 80}}>
      {/* Hero */}
      <div className="event-hero">
        <div className="event-hero-bg"/>
        <div className="container" style={{position: 'relative', zIndex: 1, paddingTop: 60}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <span className="badge">{typeEmoji[event.type]} {typeLabel[event.type]}</span>
              <h1 style={{fontSize: '3.5rem', marginTop: 12}}>{event.title}</h1>
            </div>
            {isOwner && (
              <button className="btn btn-primary" onClick={copyInviteLink}>
                <Share2 size={18}/> Копировать ссылку
              </button>
            )}
          </div>
          <div className="info-pills" style={{marginTop: 32}}>
            <div className="info-pill"><Calendar size={16}/> {new Date(event.date).toLocaleDateString('ru-RU', {day:'numeric', month:'long'})}</div>
            <div className="info-pill"><MapPin size={16}/> {event.location}</div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="events-grid" style={{gridTemplateColumns: isOwner ? '1fr' : '1fr 360px', gap: 32, marginTop: 40}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            {/* Owner Management Panel */}
            {isOwner && (
              <div className="glass" style={{padding: 32}}>
                <div className="section-title"><Users size={20} className="section-title-icon"/> Список гостей ({guests.length})</div>
                <div className="guest-list" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginTop: 20}}>
                  {guests.length === 0 ? (
                    <p style={{color: 'var(--muted)'}}>Гостей пока нет</p>
                  ) : guests.map(g => (
                    <div key={g.id} className="glass" style={{padding: 12, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)'}}>
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%', 
                        background: g.status === 'yes' ? '#22c55e' : g.status === 'no' ? '#ef4444' : '#f59e0b'
                      }}/>
                      <span style={{fontWeight: 600}}>{g.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass" style={{padding: 32}}>
              <div className="section-title"><Info size={20} className="section-title-icon"/> О событии</div>
              <p style={{color: 'var(--muted)', lineHeight: 1.8}}>{event.description}</p>
            </div>

            <CommentWall eventId={event.id} isAdmin={isOwner} />
            <Gallery images={event.gallery || []} isAdmin={isOwner} />
          </div>

          {!isOwner && (
            <div style={{position: 'sticky', top: 100, alignSelf: 'start'}}>
              <div className="glass" style={{padding: 32}}>
                {!rsvpSent ? (
                  <>
                    <div className="section-title"><Check size={20} className="section-title-icon"/> Вы придете?</div>
                    <input 
                      className="input" 
                      placeholder="Ваше имя" 
                      value={guestName} 
                      onChange={e => setGuestName(e.target.value)}
                      style={{marginBottom: 16}}
                    />
                    <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20}}>
                      <RsvpBtn active={rsvp==='yes'}   onClick={()=>setRsvp('yes')}   emoji="✅" label="Буду!" cls="active-yes"/>
                      <RsvpBtn active={rsvp==='no'}    onClick={()=>setRsvp('no')}    emoji="❌" label="Не смогу" cls="active-no"/>
                      <RsvpBtn active={rsvp==='maybe'} onClick={()=>setRsvp('maybe')} emoji="🤔" label="Возможно" cls="active-maybe"/>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      style={{width:'100%', justifyContent:'center'}} 
                      onClick={sendRsvp}
                      disabled={!guestName || !rsvp}
                    >
                      Отправить ответ
                    </button>
                  </>
                ) : (
                  <div style={{textAlign:'center'}}>
                    <div style={{fontSize:'3rem', marginBottom:12}}>🎉</div>
                    <h3>Ответ принят!</h3>
                    <p style={{color:'var(--muted)'}}>Спасибо, что подтвердили участие.</p>
                  </div>
                )}
              </div>

              <div className="glass" style={{padding: 24, marginTop: 16}}>
                <div style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16}}>Статистика</div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8}}>
                  <StatItem num={stats.yes} label="Будут" color="#22c55e"/>
                  <StatItem num={stats.no} label="Нет" color="#ef4444"/>
                  <StatItem num={stats.maybe} label="?" color="#f59e0b"/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatItem = ({num, label, color}) => (
  <div className="glass" style={{padding: '12px 4px', textAlign: 'center'}}>
    <div style={{fontSize: '1.4rem', fontWeight: 800, color}}>{num}</div>
    <div style={{fontSize: '0.65rem', color: 'var(--muted)'}}>{label}</div>
  </div>
);

const RsvpBtn = ({active, onClick, emoji, label, cls}) => (
  <button className={`rsvp-btn ${active?cls:''}`} onClick={onClick}>
    <span className="rsvp-icon">{emoji}</span>
    <span>{label}</span>
  </button>
);

export default EventPage;
