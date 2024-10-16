document.getElementById('cadastroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const aluno = {
      nome: document.getElementById('nome').value,
      data_nascimento: document.getElementById('data_nascimento').value,
      nome_mae: document.getElementById('nome_mae').value,
      nome_pai: document.getElementById('nome_pai').value,
      rg: document.getElementById('rg').value,
      cpf: document.getElementById('cpf').value,
      registro_nascimento: document.getElementById('registro_nascimento').value,
      local_nascimento: document.getElementById('local_nascimento').value,
      nacionalidade: document.getElementById('nacionalidade').value,
      local_residencia: document.getElementById('local_residencia').value,
      usa_transporte_publico: document.getElementById('usa_transporte_publico').value,
      tipo_transporte: document.getElementById('tipo_transporte').value,
      situacao_aluno: document.getElementById('situacao_aluno').value
    };
  
    try {
      const response = await fetch('/api/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno)
      });
  
      const result = await response.json();
      alert(result.message);
    } catch (err) {
      console.error('Erro:', err);
    }
  });
  