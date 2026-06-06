import { useState } from 'react';

function EstrelasInput({ avaliacao, onChange }) {
  const [hoverNota, setHoverNota] = useState(null);
  const estrelas = [1, 2, 3, 4, 5];
  const notaAtual = hoverNota !== null ? hoverNota : avaliacao;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
      <div style={{ display: 'flex' }} onMouseLeave={() => setHoverNota(null)}>
        {estrelas.map((num) => {
          let percentagemPreenchimento = 0;
          if (notaAtual >= num) {
            percentagemPreenchimento = 100;
          } else if (notaAtual === num - 0.5) {
            percentagemPreenchimento = 42;
          }

          return (
            <div
              key={num}
              style={{
                position: 'relative',
                fontSize: '36px',
                width: '36px',
                height: '40px',
                display: 'inline-block',
                cursor: 'pointer',
                userSelect: 'none',
                backgroundImage: `linear-gradient(to right, #ffc107 ${percentagemPreenchimento}%, #444444 ${percentagemPreenchimento}%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ★

              <div
                style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', zIndex: 5 }}
                onMouseEnter={() => setHoverNota(num - 0.5)}
                onClick={() => onChange(num - 0.5)}
              />

              <div
                style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', zIndex: 5 }}
                onMouseEnter={() => setHoverNota(num)}
                onClick={() => onChange(num)}
              />
            </div>
          );
        })}
      </div>

      <span style={{ marginLeft: '10px', fontSize: '18px', color: '#ffc107', fontWeight: 'bold' }}>
        {notaAtual > 0 ? `${notaAtual.toFixed(1)} / 5.0` : '0.0'}
      </span>
    </div>
  );
}

export default EstrelasInput;