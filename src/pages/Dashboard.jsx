import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { Plus, Calendar, MapPin, Copy, ExternalLink, Sparkles, User } from 'lucide-react';

const typeLabel = { wedding: 'Свадьба', birthday: 'День рождения', party: 'Вечеринка' };
const typeBadge = { wedding: 'badge-wedding', birthday: 'badge-birthday', party: 'badge-party' };

const Dashboard = () => {
  const { events } = useEvents();
  const { user } = useAuth();

  const copyLink = (code) => {
    const link = `${window.location.origin}/event/${code}`;
    navigator.clipboard.writeText(link);
    alert('Ссылка скопирована!');
  };

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <div className="dash-header">
        <div>
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
            <span className="badge" style={{background:'rgba(129,140,248,0.1)', color:'var(--accent)'}}>Личный кабинет</span>
          </div>
          <h1>Привет, {user?.email.split('@')[0]}!</h1>
          <p>Управляйте вашими праздниками и гостями в одном месте</p>
        </div>
        <Link to="/create-event" className="btn btn-primary">
          <Plus size={18} /> Создать событие
        </Link>
      </div>

      {/* Grid */}
      {events.length === 0 ? (
        <div className="glass empty-state">
          <div className="empty-state-icon">🎊</div>
          <h3>Ещё нет событий</h3>
          <p style={{ marginBottom: 28 }}>Создайте своё первое мероприятие и пригласите гостей.</p>
          <Link to="/create-event" className="btn btn-primary">
            <Plus size={16} /> Создать первое событие
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card glass">
              <div className="event-card-header">
                <span className={`badge ${typeBadge[event.type]}`}>
                  {typeLabel[event.type]}
                </span>
                <div className="event-card-actions">
                  <button className="icon-btn" title="Копировать ссылку" onClick={() => copyLink(event.code)}>
                    <Copy size={15} />
                  </button>
                  <Link to={`/event/${event.code}`} className="icon-btn" title="Открыть страницу">
                    <ExternalLink size={15} />
                  </Link>
                </div>
              </div>
              <div className="event-card-title">{event.title}</div>
              <div className="event-card-meta">
                <div className="event-card-meta-item">
                  <Calendar size={13} />
                  {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="event-card-meta-item">
                  <MapPin size={13} />
                  {event.location}
                </div>
              </div>
              <div className="event-card-footer">
                <span className="event-card-code">{event.code}</span>
                <Link to={`/event/${event.code}`} style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem' }}>
                  Управлять →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
