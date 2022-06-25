const validateWatchedAt = (req, res, next) => {
  const { watchedAt } = req.body.talk;

  if (watchedAt === ' ' || !watchedAt) { 
    return res.status(400).json({
      message: 'O campo "watchedAt" é obrigatório',
    }); 
  }

next();
};

module.exports = validateWatchedAt;