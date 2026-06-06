import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  
  const navigate = useNavigate();

  const alternarModo = () => {
    setIsLogin(!isLogin);
    setNome('');
    setEmail('');
    setPassword('');
    setErro('');
    setMensagem('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { email, password });
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.utilizador));
        
        navigate('/catalogo');
      } else {
        await api.post('/auth/register', { nome, email, password });
        setMensagem('Conta criada com sucesso! Já podes fazer login.');
        setIsLogin(true);
        setNome('');
        setPassword('');
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Ocorreu um erro. Tenta novamente.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212', color: '#e0e0e0', margin: 0, padding: '0px', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '30px', backgroundColor: '#1e1e1e', border: '1px solid #2d2d2d', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#ffffff' }}>{isLogin ? '🎬 Iniciar Sessão' : '🍿 Criar Conta'}</h2>
        
        {erro && <p style={{ color: '#ff6b6b', backgroundColor: 'rgba(255,107,107,0.1)', padding: '10px', borderRadius: '6px', fontSize: '14px' }}>{erro}</p>}
        {mensagem && <p style={{ color: '#2ecc71', backgroundColor: 'rgba(46,204,113,0.1)', padding: '10px', borderRadius: '6px', fontSize: '14px' }}>{mensagem}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Nome:</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #404040', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
          )}
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #404040', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #404040', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'background 0.2s' }}>
            {isLogin ? 'Entrar' : 'Registar'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          <button onClick={alternarModo} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', textDecoration: 'underline' }}>
            {isLogin ? 'Não tens conta? Cria uma aqui' : 'Já tens conta? Faz login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;