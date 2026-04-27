import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) return setError('Заполните все поля');
    if (password.length < 6) return setError('Пароль должен быть минимум 6 символов');
    
    setError('');
    setLoading(true);
    const { data, error: signUpError } = await signUp({ 
      email, 
      password,
      options: { data: { full_name: name } }
    });
    setLoading(false);
    
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMsg('Регистрация успешна! Проверьте вашу почту для подтверждения, либо войдите, если автоподтверждение включено.');
      setTimeout(() => navigate('/login'), 4000);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card glass">
        <span className="badge" style={{marginBottom:20}}>Новый аккаунт</span>
        <h2>Начать бесплатно</h2>
        <p className="sub">Создайте аккаунт и организуйте незабываемый праздник</p>

        {error && <div style={{background:'rgba(239,68,68,0.1)',color:'#ef4444',padding:'10px 14px',borderRadius:8,marginBottom:20,fontSize:'0.9rem'}}>{error}</div>}
        {msg && <div style={{background:'rgba(34,197,94,0.1)',color:'#16a34a',padding:'10px 14px',borderRadius:8,marginBottom:20,fontSize:'0.9rem'}}>{msg}</div>}

        <div className="auth-fields">
          <div className="form-group">
            <label className="form-label">Имя</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} className="input" placeholder="Айдар"/>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input" placeholder="example@mail.com"/>
          </div>
          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input" placeholder="Минимум 6 символов"/>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:'1rem'}}>
          <UserPlus size={17}/> {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        <p style={{textAlign:'center',color:'var(--muted)',marginTop:20,fontSize:'0.9rem'}}>
          Уже есть аккаунт? <Link to="/login" style={{color:'var(--accent)',fontWeight:700}}>Войти</Link>
        </p>
      </form>
    </div>
  );
};
export default Register;
