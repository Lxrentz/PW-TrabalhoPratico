const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'CastError') {
        return res.status(400).json({ erro: 'ID inválido' });
    }

    if (err.code === 11000) {
        const campo = Object.keys(err.keyValue)[0];
        return res.status(400).json(
            { erro: `${campo} já está em uso` }
        );
    }

    if (err.name === 'ValidationError') {
        const msgs = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ erro: msgs.join(', ') });
    }

    res.status(err.statusCode || 500).json({
        erro: err.message || 'Erro interno do servidor'
    });
};

module.exports = errorHandler;