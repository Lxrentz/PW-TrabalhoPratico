import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Catalogo() {
  const [filmes, setFilmes] = useState([]);
  const [estatisticas, setEstatisticas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const [todosOsGeneros, setTodosOsGeneros] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const carregarGenerosIniciais = async () => {
      try {
        const res = await api.get('/filmes');
        const listaGeneros = Array.from(
          new Set(res.data.flatMap(filme => filme.genero))
        ).sort((a, b) => a.localeCompare(b));
        
        setTodosOsGeneros(listaGeneros);
      } catch (err) {
        console.error('Erro ao carregar gêneros iniciais:', err);
      }
    };

    carregarGenerosIniciais();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      let urlFilmes = '/filmes';
      const params = [];
      if (filtroGenero) params.push(`genero=${filtroGenero}`);
      if (filtroEstado) params.push(`estado=${filtroEstado}`);
      if (params.length > 0) urlFilmes += `?${params.join('&')}`;

      const [resFilmes, resEst] = await Promise.all([
        api.get(urlFilmes),
        api.get('/filmes/estatisticas/media-genero')
      ]);

      setFilmes(resFilmes.data);
      setEstatisticas(resEst.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [filtroGenero, filtroEstado]);

  const handleApagar = async (id) => {
    if (window.confirm('Tem certeza que você quer apagar este filme?')) {
      try {
        await api.delete(`/filmes/${id}`);
        carregarDados();
      } catch (err) {
        alert('Erro ao eliminar o filme.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'Arial, sans-serif', margin: 0, padding: '20px 10px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 10px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2d2d2d', paddingBottom: '15px', marginBottom: '20px' }}>
          <h1 style={{ color: '#ffffff', margin: 0 }}>Olá, {user?.nome}! 👋</h1>
          <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Sair
          </button>
        </div>

        <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #2d2d2d' }}>
          <h3 style={{ color: '#ffffff', marginTop: 0, marginBottom: '15px' }}>📊 Média de Avaliações por Género (Filmes Vistos)</h3>
          {estatisticas.length === 0 ? (
            <p style={{ color: '#888888', margin: 0 }}>Avalia os teus filmes vistos para veres aqui as médias.</p>
          ) : (
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {estatisticas.map((est) => (
                <div key={est._id} style={{ backgroundColor: '#2d2d2d', padding: '10px 15px', borderRadius: '6px', border: '1px solid #404040', color: '#ffffff' }}>
                  <strong>{est._id}:</strong> ⭐ {est.mediaAvaliacao.toFixed(1)} / 5
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)} style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1e1e1e', color: '#ffffff', border: '1px solid #404040', cursor: 'pointer' }}>
              <option value="">Todos os Géneros</option>
              {todosOsGeneros.map((gen) => (
                <option key={gen} value={gen}>{gen}</option>
              ))}
            </select>

            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1e1e1e', color: '#ffffff', border: '1px solid #404040', cursor: 'pointer' }}>
              <option value="">Todos os Estados</option>
              <option value="visto">Já vi</option>
              <option value="para ver">Quero ver</option>
            </select>
          </div>

          <button onClick={() => navigate('/filme/novo')} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Adicionar Filme
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#888' }}>A carregar o teu catálogo...</p>
        ) : filmes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888888', marginTop: '40px' }}>Nenhum filme encontrado. Começa por adicionar um!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
            {filmes.map((filme) => (
              <div key={filme._id} style={{ border: '1px solid #2d2d2d', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#1e1e1e', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s' }}>
                
                <div onClick={() => navigate(`/filme/${filme._id}`)} style={{ cursor: 'pointer' }}>
                  <div style={{ width: '100%', height: '320px', backgroundColor: '#2d2d2d', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #2d2d2d' }}>
                    <img 
                      src={filme.posterUrl ? Array.isArray(filme.posterUrl) ? !filme.posterUrl[0] : filme.posterUrl : 'https://placehold.co/220x320/2d2d2d/ffffff?text=Sem+Poster'} 
                      alt={`Poster do filme ${filme.titulo}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://placehold.co/220x320/2d2d2d/ffffff?text=Sem+Poster';
                      }}
                    />
                  </div>

                  <div style={{ padding: '12px 15px 5px 15px', textAlign: 'center' }}>
                    <h3 style={{ color: '#ffffff', margin: '0 0 5px 0', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={filme.titulo}>
                      {filme.titulo}
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#888888' }}>{filme.ano}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0', marginTop: '10px', borderTop: '1px solid #2d2d2d' }}>
                  <button onClick={() => navigate(`/filme/editar/${filme._id}`)} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', color: '#ffc107', border: 'none', borderRight: '1px solid #2d2d2d', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    Editar
                  </button>
                  <button onClick={() => handleApagar(filme._id)} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', color: '#dc3545', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    Apagar
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalogo;