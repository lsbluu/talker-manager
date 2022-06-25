const validateEmail = (req, res, next) => {
  // regex serve para identificar o formato correto do email
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });

  // emailRegex.test() irá verificar se o email é true ou false
  if (!emailRegex.test(email)) {
 return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"',
}); 
}  
  next();
};

module.exports = validateEmail;
