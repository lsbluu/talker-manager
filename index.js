const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

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
