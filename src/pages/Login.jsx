import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Заполните все поля');
    setError('');
    setLoading(true);
    const { error: signInError } = await signIn({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message.includes('Credentials') ? 'Неверный email или пароль' : signInError.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card glass">
        <div className="orb orb-1" style={{opacity:0.3, width:300, height:300, top:-100, left:-100}}/>
        <div style={{position:'relative'}}>
          <span className="badge" style={{marginBottom:20}}>С возвращением</span>
          <h2>Войти в аккаунт</h2>
          <p className="sub">Продолжайте управлять своими праздниками</p>
          
          {error && <div style={{background:'rgba(239,68,68,0.1)',color:'#ef4444',padding:'10px 14px',borderRadius:8,marginBottom:20,fontSize:'0.9rem'}}>{error}</div>}

          <div className="auth-fields">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input" placeholder="example@mail.com"/>
            </div>
            <div className="form-group">
              <label className="form-label">Пароль</label>
              <div style={{position:'relative'}}>
                <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} className="input" placeholder="••••••••" style={{paddingRight:46}}/>
                <button type="button" onClick={()=>setShow(s=>!s)} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--muted)',cursor:'pointer'}}>
                  {show ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:'1rem'}}>
            <LogIn size={17}/> {loading ? 'Вход...' : 'Войти'}
          </button>
          <p style={{textAlign:'center',color:'var(--muted)',marginTop:20,fontSize:'0.9rem'}}>
            Нет аккаунта? <Link to="/register" style={{color:'var(--accent)',fontWeight:700}}>Зарегистрироваться</Link>
          </p>
        </div>
      </form>
    </div>
  );
};
export default Login;
