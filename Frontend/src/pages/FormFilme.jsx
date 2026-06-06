import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import EstrelasInput from '../components/EstrelasInput';

function FormFilme() {
  const [titulo, setTitulo] = useState('');
  const [generosSelecionados, setGenerosSelecionados] = useState([]);
  const [ano, setAno] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [estado, setEstado] = useState('para ver');
  const [avaliacao, setAvaliacao] = useState(5);
  const [comentario, setComentario] = useState('');
  const [erro, setErro] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  const [listaGeneros, setListaGeneros] = useState([
    'Ação', 'Animação', 'Comédia', 'Documentário', 'Drama', 'Fantasia', 'Ficção Científica', 'Romance', 'Suspense', 'Terror'
  ]);
  const [novoGeneroTexto, setNovoGeneroTexto] = useState('');

  const handleAdicionarNovoGenero = (e) => {
    e.preventDefault();
    const generoFormatado = novoGeneroTexto.trim();

    if (generoFormatado && !listaGeneros.includes(generoFormatado)) {
      const novaLista = [...listaGeneros, generoFormatado].sort((a, b) => a.localeCompare(b));
      setListaGeneros(novaLista);
      setGenerosSelecionados([...generosSelecionados, generoFormatado]);
      setNovoGeneroTexto('');
    }
  };

  useEffect(() => {
    const carregarDadosEGeneros = async () => {
      try {
        const response = await api.get('/filmes');
        const todosOsFilmes = response.data;

        const generosDoUtilizador = todosOsFilmes.flatMap(f => f.genero);

        const generosUnicos = Array.from(
          new Set([...listaGeneros, ...generosDoUtilizador])
        ).sort((a, b) => a.localeCompare(b));

        setListaGeneros(generosUnicos);

        if (id) {
          const filmeEditar = todosOsFilmes.find(f => f._id === id);
          if (filmeEditar) {
            setTitulo(filmeEditar.titulo);
            setGenerosSelecionados(filmeEditar.genero);
            setAno(filmeEditar.ano);
            setSinopse(filmeEditar.sinopse || '');
            setPosterUrl(filmeEditar.posterUrl || '');
            setEstado(filmeEditar.estado);
            setAvaliacao(filmeEditar.avaliacao || 5);
            setComentario(filmeEditar.comentario || '');
          }
        }
      } catch (err) {
        setErro('Erro ao carregar os dados da aplicação.');
      }
    };

    carregarDadosEGeneros();
  }, [id]);

  const handleGeneroChange = (genero) => {
    if (generosSelecionados.includes(genero)) {
      setGenerosSelecionados(generosSelecionados.filter(g => g !== genero));
    } else {
      setGenerosSelecionados([...generosSelecionados, genero]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (generosSelecionados.length === 0) {
      setErro('Por favor, seleciona pelo menos um género.');
      return;
    }

    const dadosFilme = {
      titulo,
      genero: generosSelecionados,
      ano: Number(ano),
      sinopse,
      posterUrl,
      estado,
      ...(estado === 'visto' && { avaliacao: Number(avaliacao), comentario })
    };

    try {
      if (id) {
        await api.put(`/filmes/${id}`, dadosFilme);
      } else {
        await api.post('/filmes', dadosFilme);
      }
      navigate('/catalogo');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao guardar o filme. Verifica os dados.');
    }
  };

return (
    <div style={{ backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', fontFamily: 'Arial, sans-serif', margin: 0, padding: '30px 20px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '25px', backgroundColor: '#1e1e1e', border: '1px solid #2d2d2d', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <h2 style={{ color: '#ffffff', marginTop: 0, marginBottom: '20px' }}>{id ? '🎬 Editar Filme' : '🍿 Adicionar Novo Filme'}</h2>
        
        {erro && <p style={{ color: '#ff6b6b', fontWeight: 'bold', backgroundColor: 'rgba(255,107,107,0.1)', padding: '10px', borderRadius: '6px' }}>{erro}</p>}

        <form onSubmit={handleSubmit}>
          {/* TÍTULO */}
          <div style={{ marginBottom: '15px' }}>
            <label><strong>Título do Filme:</strong></label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #404040', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>

          {/* ANO */}
          <div style={{ marginBottom: '15px' }}>
            <label><strong>Ano de Lançamento:</strong></label>
            <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #404040', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>

          {/* LINK DO POSTER */}
          <div style={{ marginBottom: '15px' }}>
            <label><strong>Link do Poster (URL da Imagem):</strong></label>
            <input type="url" placeholder="https://exemplo.com/poster.jpg" value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #404040', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>

          {/* GÉNEROS DINÂMICOS */}
          <div style={{ marginBottom: '20px' }}>
            <label><strong>Géneros (Selecione um ou mais):</strong></label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px', marginBottom: '12px' }}>
              {listaGeneros.map((gen) => (
                <label key={gen} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#cccccc' }}>
                  <input type="checkbox" checked={generosSelecionados.includes(gen)} onChange={() => handleGeneroChange(gen)} style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                  {gen}
                </label>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input type="text" placeholder="Outro género..." value={novoGeneroTexto} onChange={(e) => setNovoGeneroTexto(e.target.value)} style={{ flex: 1, padding: '8px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #404040', borderRadius: '6px' }} />
              <button type="button" onClick={handleAdicionarNovoGenero} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Adicionar
              </button>
            </div>
          </div>

          {/* SINOPSE */}
          <div style={{ marginBottom: '15px' }}>
            <label><strong>Sinopse / Resumo:</strong></label>
            <textarea value={sinopse} onChange={(e) => setSinopse(e.target.value)} rows="3" style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #404040', borderRadius: '6px', resize: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* ESTADO */}
          <div style={{ marginBottom: '15px' }}>
            <label><strong>Estado de Visualização:</strong></label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #404040', borderRadius: '6px', cursor: 'pointer' }}>
              <option value="para ver">Quero ver</option>
              <option value="visto">Já vi</option>
            </select>
          </div>

          {/* CAMPOS EXTRA */}
          {estado === 'visto' && (
            <div style={{ backgroundColor: '#2d2d2d', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #404040' }}>
              <div style={{ marginBottom: '12px' }}>
                <label><strong>A tua Avaliação (Clica nas estrelas):</strong></label>
                <EstrelasInput avaliacao={avaliacao} onChange={(nota) => setAvaliacao(nota)} />
              </div>

              <div>
                <label><strong>Comentário Pessoal:</strong></label>
                <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="O que achaste do filme?" rows="2" style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#1e1e1e', color: '#ffffff', border: '1px solid #404040', borderRadius: '6px', resize: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          {/* BOTÕES DE AÇÃO */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
            <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Gravar
            </button>
            <button type="button" onClick={() => navigate('/catalogo')} style={{ flex: 1, padding: '12px', backgroundColor: '#444444', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormFilme;