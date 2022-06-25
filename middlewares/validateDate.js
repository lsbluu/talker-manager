const validateDate = (req, res, next) => {
  const { watchedAt } = req.body.talk;

  const regexDate = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

  if (!regexDate.test(watchedAt)) { 
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    }); 
  }

next();
};

module.exports = validateDate;