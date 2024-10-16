const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect(err => {
  if (err) throw err;
  console.log('Banco de dados conectado!');
});

// Endpoint para cadastro de aluno
app.post('/api/alunos', (req, res) => {
  const { nome, data_nascimento, nome_mae, nome_pai, rg, cpf, registro_nascimento, local_nascimento, nacionalidade, local_residencia, usa_transporte_publico, tipo_transporte, situacao_aluno } = req.body;
  
  const sql = `INSERT INTO alunos (nome, data_nascimento, nome_mae, nome_pai, rg, cpf, registro_nascimento, local_nascimento, nacionalidade, local_residencia, usa_transporte_publico, tipo_transporte, situacao_aluno)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nome, data_nascimento, nome_mae, nome_pai, rg, cpf, registro_nascimento, local_nascimento, nacionalidade, local_residencia, usa_transporte_publico, tipo_transporte, situacao_aluno], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Aluno cadastrado com sucesso!' });
  });
});

// Endpoint para registro de usuários
app.post('/api/register', async (req, res) => {
  const { email, cpf, rg, codinome, senha } = req.body;

  const hashedPassword = await bcrypt.hash(senha, 10);
  
  const sql = `INSERT INTO usuarios (email, cpf, rg, codinome, senha) VALUES (?, ?, ?, ?, ?)`;
  
  db.query(sql, [email, cpf, rg, codinome, hashedPassword], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Usuário registrado com sucesso!' });
  });
});

// Endpoint para login
app.post('/api/login', (req, res) => {
  const { login, senha } = req.body;
  
  const sql = `SELECT * FROM usuarios WHERE email = ? OR cpf = ? OR rg = ? OR codinome = ?`;
  
  db.query(sql, [login, login, login, login], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(400).json({ message: 'Usuário não encontrado' });
    
    const user = results[0];
    
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  });
});

// Endpoint para redefinir senha
app.post('/api/reset-password', (req, res) => {
  const { email } = req.body;
  
  // Lógica para enviar email de redefinição de senha com Nodemailer
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

const path = require('path');

// Serve arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
