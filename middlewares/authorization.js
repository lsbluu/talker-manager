const authorization = (req, res, next) => {
  const value = req.headers.authorization;
  if (!value) {
 return res.status(401).json({
  message: 'Token não encontrado',
  }); 
}
if (value.length < 16) {
  return res.status(401).json({
   message: 'Token inválido',
   }); 
 }
next();
};

module.exports = authorization;