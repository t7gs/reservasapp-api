const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');



const app = express();
const PORT = process.env.PORT || 3000;


// Configurações de conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres.nsciyimnadkqakoiesql',
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  database: 'postgres',
  password: 'hwYiCAMhxbLEx4Nf',
  port: 5432, // Porta padrão do PostgreSQL
});


// Middleware para processar o corpo das requisições
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

  // Aqui você pode salvar os dados no PostgreSQL
  pool.query('INSERT INTO reservas (nome, horario) VALUES ($1, $2)', [nome, horario], (err, result) => {
    if (err) {
      console.error('Erro ao agendar horário:', err);
      return res.status(500).json({ message: 'Erro ao agendar horário. Por favor, tente novamente mais tarde.' });
    }
    result.status(200).json({ message: 'Horário agendado com sucesso.' });
  });

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