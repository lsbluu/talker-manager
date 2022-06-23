const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online'); 
});

app.get('/talker', async (req, res) => {
  const talker = await fs.readFile('./talker.json', 'utf-8');
  const jsonparse = JSON.parse(talker);
  res.json(jsonparse);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;  
  const talkers = await fs.readFile('./talker.json', 'utf-8');
  const talkersJson = JSON.parse(talkers);
  const talkerId = talkersJson.find((t) => t.id === Number(id));

  if (!talkerId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.json(talkerId);
});

const generateToken = () => crypto.randomBytes(8).toString('hex');

const validateEmail = (req, res, next) => {
  // regex serve para identificar o formato correto do email
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });

  // emailRegex.test() irá verificar se o email é true ou false
  if (!emailRegex.test(email)) {
 return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"',
}); 
}

  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
     
   if (password.length < 6) { 
     return res.status(400)
    .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

app.post('/login', validateEmail, async (req, res) => {
const { email, password } = req.body;
const token = generateToken();
res.json({ email, password, token });
});
