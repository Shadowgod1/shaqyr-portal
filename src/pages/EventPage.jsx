import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { MapPin, Calendar, Clock, Check, X, Info } from 'lucide-react';
import CommentWall from '../components/CommentWall';
import Gallery from '../components/Gallery';

const typeLabel  = { wedding:'Свадьба', birthday:'День рождения', party:'Вечеринка' };
const typeEmoji  = { wedding:'💍', birthday:'🎂', party:'🎉' };

const EventPage = () => {
  const { code } = useParams();
  const { getEventByCode } = useEvents();
  const [event, setEvent] = useState(null);
  const [locked, setLocked] = useState(true);
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [rsvp, setRsvp] = useState(null);
  const [comment, setComment] = useState('');
  const [rsvpSent, setRsvpSent] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const e = await getEventByCode(code?.toUpperCase());
      setEvent(e || null);
    };
    if (code) fetchEvent();
  }, [code, getEventByCode]);

  const unlock = () => {
    if (inputCode.toUpperCase() === event?.code) {
      setLocked(false); setError('');
    } else {
      setError('Неверный код. Проверьте приглашение.');
      setInputCode('');
    }
  };

  if (!event) return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
      <div>
        <div style={{fontSize:'4rem',marginBottom:20}}>🔍</div>
        <h2 style={{fontSize:'1.6rem',fontWeight:800,marginBottom:10}}>Событие не найдено</h2>
        <p style={{color:'var(--muted)'}}>Проверьте правильность кода или ссылки.</p>
      </div>
    </div>
  );

  if (locked) return (
    <div className="lock-screen">
      <div className="orb orb-1"/>
      <div className="orb orb-2"/>
      <div className="lock-card glass">
        <span className="lock-icon">{typeEmoji[event.type]}</span>
        <h2>Закрытое мероприятие</h2>
        <p>Введите секретный код из вашего приглашения, чтобы открыть страницу события.</p>
        <input
          className="input code-input"
          maxLength={6}
          placeholder="XXXXXX"
          value={inputCode}
          onChange={e => setInputCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && unlock()}
          autoFocus
        />
        {error && <p style={{color:'#ef4444',fontSize:'0.88rem',marginBottom:12,marginTop:-8}}>{error}</p>}
        <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'15px',fontSize:'1rem'}} onClick={unlock}>
          Открыть приглашение ✨
        </button>
        <p style={{color:'var(--muted)',fontSize:'0.8rem',marginTop:20}}>Код можно найти в сообщении от организатора</p>
      </div>
    </div>
  );

  return (
    <div data-theme={event.type} style={{minHeight:'100vh',transition:'all 0.5s ease'}}>
      {/* Hero */}
      <div className="event-hero">
        <div className="event-hero-bg"/>
        <div className="container event-hero-content" style={{width:'100%'}}>
          <span className={`badge badge-${event.type}`}>{typeEmoji[event.type]} {typeLabel[event.type]}</span>
          <h1 className="event-hero">{event.title}</h1>
          <div className="info-pills">
            <div className="info-pill"><Calendar size={15}/> {new Date(event.date).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}</div>
            <div className="info-pill"><Clock size={15}/> 18:00</div>
            <div className="info-pill"><MapPin size={15}/> {event.location}</div>
          </div>
        </div>
      </div>

      <div className="container" style={{paddingBottom:80}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 360px', gap:28, marginTop:32}}>
          {/* Left column */}
          <div>
            {/* About */}
            <div className="glass" style={{padding:32, marginBottom:24}}>
              <div className="section-title"><Info size={20} className="section-title-icon"/> О событии</div>
              <p style={{color:'var(--muted)',lineHeight:1.8,fontSize:'1rem'}}>
                {event.description || 'Вы приглашены на наш праздник! Мы будем рады видеть вас в этот особенный день.'}
              </p>
            </div>

            {/* Timeline */}
            <div className="glass" style={{padding:32, marginBottom:24}}>
              <div className="section-title"><Clock size={20} className="section-title-icon"/> Программа дня</div>
              <div className="timeline">
                <TItem time="17:00" title="Сбор гостей" desc="Welcome-drink и закуски"/>
                <TItem time="18:00" title="Начало торжества" desc="Торжественная часть"/>
                <TItem time="19:30" title="Праздничный ужин" desc="Банкет и поздравления"/>
                <TItem time="21:00" title="Танцы и фото" desc="Дискотека и торт"/>
              </div>
            </div>

            <Gallery images={[]} isAdmin={false}/>
            <CommentWall comments={[]} isAdmin={false}/>
          </div>

          {/* RSVP Panel */}
          <div style={{position:'sticky', top:100, alignSelf:'start'}}>
            <div className="glass" style={{padding:28}}>
              {!rsvpSent ? (
                <>
                  <div className="section-title"><Check size={20} className="section-title-icon"/> Ваш ответ</div>
                  <p style={{color:'var(--muted)',fontSize:'0.9rem',marginBottom:20,lineHeight:1.6}}>Пожалуйста, подтвердите участие. Это поможет организаторам.</p>
                  <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
                    <RsvpBtn active={rsvp==='yes'}   onClick={()=>setRsvp('yes')}   emoji="✅" label="Буду!" cls="active-yes"/>
                    <RsvpBtn active={rsvp==='no'}    onClick={()=>setRsvp('no')}    emoji="❌" label="Не смогу" cls="active-no"/>
                    <RsvpBtn active={rsvp==='maybe'} onClick={()=>setRsvp('maybe')} emoji="🤔" label="Возможно" cls="active-maybe"/>
                  </div>
                  {rsvp && (
                    <>
                      <textarea className="input" rows={3} placeholder="Ваш комментарий или пожелание..." value={comment} onChange={e=>setComment(e.target.value)} style={{marginBottom:14,resize:'vertical'}}/>
                      <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>setRsvpSent(true)}>
                        Отправить ответ
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div style={{textAlign:'center', padding:'20px 0'}}>
                  <div style={{fontSize:'3rem',marginBottom:14}}>🎉</div>
                  <h3 style={{fontWeight:800,marginBottom:8}}>Ответ принят!</h3>
                  <p style={{color:'var(--muted)',fontSize:'0.9rem'}}>
                    {rsvp==='yes' ? 'Отлично, ждём вас!' : rsvp==='no' ? 'Жаль, что не сможете прийти!' : 'Будем ждать вашего решения!'}
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="glass" style={{padding:24,marginTop:16}}>
              <div style={{fontSize:'0.8rem',fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:16}}>Статистика</div>
              <div className="stats-row" style={{gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                <div className="stat-card glass" style={{padding:'14px 10px'}}>
                  <div className="stat-number" style={{color:'#22c55e',fontSize:'1.5rem'}}>12</div>
                  <div className="stat-label" style={{fontSize:'0.7rem'}}>Придут</div>
                </div>
                <div className="stat-card glass" style={{padding:'14px 10px'}}>
                  <div className="stat-number" style={{color:'#ef4444',fontSize:'1.5rem'}}>3</div>
                  <div className="stat-label" style={{fontSize:'0.7rem'}}>Не придут</div>
                </div>
                <div className="stat-card glass" style={{padding:'14px 10px'}}>
                  <div className="stat-number" style={{color:'#f59e0b',fontSize:'1.5rem'}}>5</div>
                  <div className="stat-label" style={{fontSize:'0.7rem'}}>Думают</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TItem = ({time,title,desc}) => (
  <div className="timeline-item">
    <div className="timeline-left">{time}</div>
    <div className="timeline-line">
      <div className="timeline-dot"/>
      <div className="timeline-connector"/>
    </div>
    <div className="timeline-content">
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  </div>
);

const RsvpBtn = ({active,onClick,emoji,label,cls}) => (
  <button className={`rsvp-btn ${active?cls:''}`} onClick={onClick}>
    <span className="rsvp-icon">{emoji}</span>
    <span>{label}</span>
    {active && <span style={{marginLeft:'auto',color:'var(--accent)',fontSize:'1.1rem'}}>✓</span>}
  </button>
);

export default EventPage;
