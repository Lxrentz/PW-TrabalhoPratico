import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function DetalhesFilme() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filme, setFilme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarFilme = async () => {
      try {
        const response = await api.get('/filmes');
        const encontrado = response.data.find(f => f._id === id);
        setFilme(encontrado);
      } catch (err) {
        console.error("Erro ao carregar filme", err);
      } finally {
        setLoading(false);
      }
    };
    buscarFilme();
  }, [id]);

  if (loading) return <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: '50px' }}>A carregar...</div>;
  if (!filme) return <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: '50px' }}>Filme não encontrado.</div>;

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/catalogo')} style={{ backgroundColor: 'transparent', color: '#aaa', border: '1px solid #444', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', marginBottom: '30px' }}>
          ← Voltar ao Catálogo
        </button>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <img 
              src={filme.posterUrl || 'https://placehold.co/300x450/2d2d2d/ffffff?text=Sem+Poster'} 
              alt={filme.titulo} 
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
            />
          </div>

          <div style={{ flex: '2', minWidth: '300px' }}>
            <h1 style={{ color: '#fff', fontSize: '42px', margin: '0 0 10px 0' }}>{filme.titulo}</h1>
            <p style={{ fontSize: '20px', color: '#888', margin: '0 0 20px 0' }}>{filme.ano}</p>

            <div style={{ marginBottom: '20px' }}>
              {filme.genero.map((gen, idx) => (
                <span key={idx} style={{ backgroundColor: '#e50914', color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', marginRight: '10px' }}>
                  {gen}
                </span>
              ))}
            </div>

            <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', border: '1px solid #2d2d2d', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', marginTop: 0 }}>Sinopse</h3>
              <p style={{ lineHeight: '1.6', color: '#ccc' }}>{filme.sinopse || 'Este filme ainda não tem uma sinopse.'}</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1, backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '12px', border: '1px solid #2d2d2d' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#888' }}>Estado</h4>
                <span style={{ color: filme.estado === 'visto' ? '#2ecc71' : '#f39c12', fontWeight: 'bold', fontSize: '18px' }}>
                  {filme.estado === 'visto' ? '✅ JÁ VISTO' : '⏳ PARA VER'}
                </span>
              </div>
              
              {filme.estado === 'visto' && (
                <div style={{ flex: 1, backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '12px', border: '1px solid #2d2d2d' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#888' }}>A tua nota</h4>
                  <div style={{ fontSize: '22px', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {Array.from({ length: 5 }, (_, index) => {
                      const num = index + 1;
                      if (filme.avaliacao >= num) return <span key={index}>★</span>;
                      if (filme.avaliacao === num - 0.5) return <span key={index} style={{ position: 'relative', display: 'inline-block', width: '11px', overflow: 'hidden' }}>★</span>; // Representação simplificada de meia estrela texto
                      return <span key={index} style={{ color: '#444' }}>★</span>;
                    })}
                    <span style={{ fontSize: '14px', color: '#aaa', marginLeft: '10px' }}>({filme.avaliacao.toFixed(1)})</span>
                  </div>
                </div>
              )}
            </div>

            {filme.estado === 'visto' && filme.comentario && (
              <div style={{ backgroundColor: 'rgba(229, 9, 20, 0.1)', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #e50914' }}>
                <h3 style={{ color: '#fff', marginTop: 0 }}>O teu comentário</h3>
                <p style={{ fontStyle: 'italic', color: '#eee' }}>"{filme.comentario}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesFilme;