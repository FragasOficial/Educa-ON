document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Evita o recarregamento da página

    const formData = new FormData(this);
    const data = {};

    // Preencher o objeto data com os valores do formulário
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Enviar os dados para o backend (Node.js)
    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Envio de dados no formato JSON
        },
        body: JSON.stringify(data)  // Converter o objeto para uma string JSON
    })
    .then(response => response.text())
    .then(message => {
        alert(message);  // Exibir uma mensagem de sucesso ou erro
    })
    .catch(error => {
        console.error('Erro:', error);  // Logar erro no console
    });
});
