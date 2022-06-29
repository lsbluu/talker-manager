const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const talkerPath = './talker.json';

const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateRate = require('./middlewares/validateRate');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateDate = require('./middlewares/validateDate');
const authorization = require('./middlewares/authorization');
const generateToken = require('./middlewares/generateToken');

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
  const talker = await fs.readFile(talkerPath, 'utf-8');
  const jsonparse = JSON.parse(talker);
  res.json(jsonparse);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;  
  const talkers = await fs.readFile(talkerPath, 'utf-8');
  const talkersJson = JSON.parse(talkers);
  const talkerId = talkersJson.find((t) => t.id === Number(id));

  if (!talkerId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.json(talkerId);
});

app.post('/login', validateEmail, validatePassword, async (req, res) => {
const { email, password } = req.body;
const token = generateToken();

res.json({ email, password, token });
});

app.post('/talker', 
authorization,
validateName, 
validateAge, 
validateTalk, 
validateRate, 
validateWatchedAt, 
validateDate, async (req, res) => {
  const { name, age, talk } = req.body;

  const talkerOld = await fs.readFile(talkerPath, 'utf-8');
  const talkerOldJson = JSON.parse(talkerOld);

  const talkerNew = {
    name,
    age,
    id: talkerOldJson.length + 1,
    talk,
  };

  talkerOldJson.push(talkerNew);
    await fs.writeFile('./talker.json', JSON.stringify(talkerOldJson));

  res.status(201).json(talkerNew);
});

app.put('/talker/:id', 
authorization, 
validateName, 
validateAge, 
validateTalk, 
validateRate, 
validateWatchedAt, 
validateDate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talkerFile = await fs.readFile(talkerPath, 'utf-8');
  const talkerParsed = JSON.parse(talkerFile);
  const talkerIndex = talkerParsed.findIndex((t) => t.id === Number(id));

  talkerParsed[talkerIndex] = { ...talkerParsed[talkerIndex], name, age, talk };

  await fs.writeFile('./talker.json', JSON.stringify(talkerParsed));

  res.status(200).json(talkerParsed[talkerIndex]);
});

app.delete('/talker/:id', authorization, async (req, res) => {
  const { id } = req.params;
  const talkerFile = await fs.readFile(talkerPath, 'utf-8');
  const talkerParsed = JSON.parse(talkerFile);

  const talkerIndex = talkerParsed.findIndex((t) => t.id === Number(id));

 talkerParsed.splice(talkerIndex, 1);

  await fs.writeFile(talkerPath, JSON.stringify(talkerParsed));

  res.status(204).end();
});
