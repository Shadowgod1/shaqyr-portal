import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home = () => (
  <div style={{position:'relative', overflow:'hidden'}}>
    {/* Hero */}
    <div className="hero">
      <div className="orb orb-1"/>
      <div className="orb orb-2"/>
      <div style={{position:'relative', zIndex:1}}>
        <span className="hero-eyebrow">✨ Shaqyr — создано для особенных моментов</span>
        <h1>
          Твой праздник заслуживает<br/>
          <span className="gradient-text">идеального портала</span>
        </h1>
        <p>Свадьбы, дни рождения, закрытые вечеринки — управляй гостями, RSVP и фотографиями в одном красивом месте.</p>
        <div className="hero-cta">
          <Link to="/register" className="btn btn-primary" style={{fontSize:'1.05rem', padding:'15px 32px'}}>
            Создать событие <ArrowRight size={18}/>
          </Link>
          <Link to="/dashboard" className="btn btn-ghost" style={{fontSize:'1.05rem', padding:'15px 32px'}}>
            Мои события
          </Link>
        </div>
      </div>
    </div>

    {/* Features */}
    <div className="container section">
      <div style={{textAlign:'center', marginBottom:56}}>
        <span className="badge" style={{marginBottom:16}}>Возможности</span>
        <h2 style={{fontSize:'2.2rem', fontWeight:900, marginBottom:14}}>Всё что нужно для праздника</h2>
        <p style={{color:'var(--muted)', maxWidth:480, margin:'0 auto', lineHeight:1.7}}>От создания приглашений до галереи фотографий — ваши гости будут в восторге.</p>
      </div>
      <div className="features">
        <FeatureCard emoji="💍" title="Свадьбы" desc="Элегантные темы, управление списком гостей, меню и тайминг церемонии."/>
        <FeatureCard emoji="🎂" title="Дни рождения" desc="Яркие темы, стена пожеланий, галерея и счётчик гостей."/>
        <FeatureCard emoji="🎉" title="Вечеринки" desc="Доступ по секретному коду, неоновый стиль и живые обновления."/>
      </div>
    </div>

    {/* How it works */}
    <div className="container" style={{paddingBottom:100}}>
      <div style={{textAlign:'center', marginBottom:56}}>
        <span className="badge" style={{marginBottom:16}}>Как это работает</span>
        <h2 style={{fontSize:'2.2rem', fontWeight:900}}>Три простых шага</h2>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32, position:'relative'}}>
        <Step n="1" title="Создай событие" desc="Заполни детали, выбери тему и получи уникальный 6-значный код доступа."/>
        <Step n="2" title="Пригласи гостей" desc="Поделись кодом или ссылкой в любом мессенджере — никаких сложностей."/>
        <Step n="3" title="Управляй в реальном времени" desc="Смотри кто придёт, читай пожелания и загружай фото прямо с телефона."/>
      </div>
    </div>
  </div>
);

const FeatureCard = ({emoji, title, desc}) => (
  <div className="feature-card glass fade-up">
    <div className="feature-icon">{emoji}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

const Step = ({n, title, desc}) => (
  <div className="glass" style={{padding:'36px 28px', textAlign:'center'}}>
    <div style={{
      width:52, height:52, borderRadius:'50%',
      background:'linear-gradient(135deg, var(--accent), var(--accent2))',
      boxShadow:'0 0 24px var(--glow)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:'1.4rem', fontWeight:900, margin:'0 auto 20px'
    }}>{n}</div>
    <h3 style={{fontWeight:800, marginBottom:10}}>{title}</h3>
    <p style={{color:'var(--muted)', lineHeight:1.6, fontSize:'0.92rem'}}>{desc}</p>
  </div>
);

export default Home;
