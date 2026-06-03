const mongoose = require('mongoose');

const FilmeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  genero: { type: [String], required: true },
  ano: { type: Number, required: true },
  sinopse: { type: String },
  posterUrl: { type: String },
  estado: { type: String, enum: ['visto', 'para ver'], default: 'para ver' },
  avaliacao: { type: Number, min: 1, max: 5 },
  comentario: { type: String },
  utilizadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador', required: true }
});

module.exports = mongoose.model('Filme', FilmeSchema);