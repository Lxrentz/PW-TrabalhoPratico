const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Filme = require('../models/Filme');
const { proteger } = require('../middlewares/auth');

// 1. Adicionar Filme (POST /api/filmes)
router.post('/', proteger, async (req, res, next) => {
    try {
        const novoFilme = await Filme.create({
            ...req.body,
            utilizadorId: req.utilizador._id
        });
        res.status(201).json(novoFilme);
    } catch (err) {
        next(err);
    }
});

// 2. Listar Filmes com Filtros (GET /api/filmes)
router.get('/', proteger, async (req, res, next) => {
    try {
        const { genero, ano, estado } = req.query;
        
        let query = { utilizadorId: req.utilizador._id };

        if (genero) query.genero = genero;
        if (ano) query.ano = Number(ano);
        if (estado) query.estado = estado;

        const filmes = await Filme.find(query);
        res.json(filmes);
    } catch (err) {
        next(err);
    }
});

// 3. Média de Avaliações por Género (GET /api/filmes/estatisticas/media-genero)
router.get('/estatisticas/media-genero', proteger, async (req, res, next) => {
    try {
        const medias = await Filme.aggregate([
            {
                $match: {
                    utilizadorId: req.utilizador._id, estado: 'visto'
                }
            },

            {
                $unwind: '$genero'
            },

            {
                $group: {
                    _id: '$genero',
                    mediaAvaliacao: { $avg: '$avaliacao' }
                }
            }
        ]);
        res.json(medias);
    } catch (err) {
        next(err);
    }
});

// 4. Editar Filme (PUT /api/filmes/:id)
router.put('/:id', proteger, async (req, res, next) => {
    try {
        let filme = await Filme.findOne({ _id: req.params.id, utilizadorId: req.utilizador._id });
        
        if (!filme) return res.status(404).json({ erro: 'Filme não encontrado' });

        filme = await Filme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(filme);
    } catch (err) {
        next(err);
    }
});

// 5. Eliminar Filme (DELETE /api/filmes/:id)
router.delete('/:id', proteger, async (req, res, next) => {
    try {
        const filme = await Filme.findOneAndDelete({ _id: req.params.id, utilizadorId: req.utilizador._id });
        
        if (!filme) return res.status(404).json({ erro: 'Filme não encontrado' });

        res.json({ mensagem: 'Filme eliminado com sucesso' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;