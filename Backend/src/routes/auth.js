const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilizador = require('../models/Utilizador');

router.post('/register', async (req, res, next) => {
    try {
        const { nome, email, password } = req.body;

        const utilizadorExiste = await Utilizador.findOne({ email });
        if (utilizadorExiste) {
            return res.status(400).json({ erro: 'Este email já está registado' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const novoUtilizador = await Utilizador.create({
            nome,
            email,
            password: passwordEncriptada
        });

        res.status(201).json({ mensagem: 'Utilizador registado com sucesso!' });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const utilizador = await Utilizador.findOne({ email });
        if (!utilizador) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const passwordCorreta = await bcrypt.compare(password, utilizador.password);
        if (!passwordCorreta) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: utilizador._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({
            token,
            utilizador: { id: utilizador._id, nome: utilizador.nome, email: utilizador.email }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;