const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

let agendamentos = []; // Array para armazenar os agendamentos

// Função para gerar um ID único
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Rota para agendar um horário
app.post('/agendar', (req, res) => {
  const { nome, horario } = req.body;
  const id = generateId(); // Gerando um ID único para o agendamento
  const agendamento = { id, nome, horario };
  agendamentos.push(agendamento);
  res.json({ message: 'Agendamento realizado com sucesso!', agendamento });
});

// Rota para consultar todos os agendamentos
app.get('/agendamentos', (req, res) => {
  res.json(agendamentos);
});

// Rota para editar um agendamento pelo ID
app.put('/agendamentos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, horario } = req.body;
  const index = agendamentos.findIndex(agendamento => agendamento.id === id);
  if (index !== -1) {
    agendamentos[index] = { ...agendamentos[index], nome, horario };
    res.json({ message: 'Agendamento editado com sucesso!', agendamento: agendamentos[index] });
  } else {
    res.status(404).json({ error: 'Agendamento não encontrado.' });
  }
});

// Rota para deletar um agendamento pelo ID
app.delete('/agendamentos/:id', (req, res) => {
  const { id } = req.params;
  const index = agendamentos.findIndex(agendamento => agendamento.id === id);
  if (index !== -1) {
    agendamentos.splice(index, 1);
    res.json({ message: 'Agendamento deletado com sucesso!' });
  } else {
    res.status(404).json({ error: 'Agendamento não encontrado.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
