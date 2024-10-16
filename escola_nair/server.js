require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com MySQL usando variáveis do .env
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL conectado');
});

// Cadastro de Alunos
app.post('/cadastro', async (req, res) => {
  const { nome_aluno, data_nascimento, nome_mae, nome_pai, rg, cpf, registro_nascimento, local_nascimento, nacionalidade, local_residencia, usa_transporte_publico, tipo_transporte } = req.body;

  const sql = `INSERT INTO alunos (nome_aluno, data_nascimento, nome_mae, nome_pai, rg, cpf, registro_nascimento, local_nascimento, nacionalidade, local_residencia, usa_transporte_publico, tipo_transporte) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nome_aluno, data_nascimento, nome_mae, nome_pai, rg, cpf, registro_nascimento, local_nascimento, nacionalidade, local_residencia, usa_transporte_publico, tipo_transporte], (err, result) => {
    if (err) throw err;
    res.send('Aluno cadastrado com sucesso!');
  });
});

// Tela de Login
app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;
  const sql = `SELECT * FROM login WHERE email = ? OR cpf = ? OR rg = ? OR codinome = ?`;

  db.query(sql, [usuario, usuario, usuario, usuario], async (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const comparison = await bcrypt.compare(senha, results[0].senha);
      if (comparison) {
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ message: 'Login bem-sucedido', token });
      } else {
        res.status(401).send('Senha incorreta');
      }
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  });
});

// Redefinição de Senha (enviar email de verificação)
app.post('/redefinir-senha', async (req, res) => {
  const { email } = req.body;
  const sql = `SELECT * FROM login WHERE email = ?`;

  db.query(sql, [email], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Redefinição de senha',
        text: 'Clique no link para redefinir sua senha: http://localhost:3000/redefinir-senha/' + results[0].id
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send('Erro ao enviar email');
        }
        res.send('Email de redefinição de senha enviado com sucesso');
      });
    } else {
      res.status(404).send('Email não encontrado');
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});

db.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao MySQL:', err);
      return;
    }
    console.log('Conectado ao MySQL com sucesso!');
  });
  
  app.use(express.static('public'));  // Aqui, 'public' é o nome da pasta onde os arquivos frontend estarão.

  app.post('/cadastro', async (req, res) => {
    const {
      nome_aluno,
      data_nascimento,
      nome_mae,
      nome_pai,
      rg,
      cpf,
      registro_nascimento,
      local_nascimento,
      nacionalidade,
      local_residencia,
      usa_transporte_publico,
      tipo_transporte
    } = req.body;
  
    // Verifica se todos os campos necessários estão preenchidos
    if (!nome_aluno || !data_nascimento || !nome_mae || !cpf) {
      return res.status(400).send('Por favor, preencha todos os campos obrigatórios.');
    }
  
    // Consulta SQL para inserir os dados no banco
    const sql = `INSERT INTO alunos (nome_aluno, data_nascimento, nome_mae, nome_pai, rg, cpf, registro_nascimento, local_nascimento, nacionalidade, local_residencia, usa_transporte_publico, tipo_transporte) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    // Executa a query no banco de dados
    db.query(sql, [
      nome_aluno, data_nascimento, nome_mae, nome_pai, rg, cpf, registro_nascimento, local_nascimento, nacionalidade, local_residencia, usa_transporte_publico, tipo_transporte
    ], (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar aluno:', err);
        return res.status(500).send('Erro ao cadastrar aluno.');
      }
      res.send('Aluno cadastrado com sucesso!');
    });
  });

  const cors = require('cors');
app.use(cors());

  