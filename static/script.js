let lastSolution = null;

function generateTable() {
    const rows = document.getElementById('rows').value;
    const columns = document.getElementById('columns').value;
    const table = document.getElementById('dynamicTable');
    
    table.innerHTML = '';
    lastSolution = null;

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('td');
            cell.textContent = '';
            cell.onclick = () => updateCell(cell);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Mostra o botão "Enviar Dados" após gerar a tabela
    document.getElementById('sendDataButton').style.display = 'inline-block';
    updateSendButtonState();
}

function updateCell(cell) {
    const options = ['', 'E', 'S', '#'];
    let currentIndex = options.indexOf(cell.textContent);
    currentIndex = (currentIndex + 1) % options.length;
    cell.textContent = options[currentIndex];
    
    clearPath();

    switch (cell.textContent) {
        case 'E':
            cell.style.backgroundColor = '#28a745';
            cell.style.color = 'white';
            break;
        case 'S':
            cell.style.backgroundColor = '#dc3545';
            cell.style.color = 'white';
            break;
        case '#':
            cell.style.backgroundColor = '#ffc107';
            cell.style.color = 'black';
            break;
        default:
            cell.style.backgroundColor = '';
            cell.style.color = '';
            break;
    }

    updateSendButtonState();
}

function updateSendButtonState() {
    const table = document.getElementById('dynamicTable');
    let hasE = false;
    let hasS = false;

    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            const cellValue = table.rows[i].cells[j].textContent;
            if (cellValue === 'E') hasE = true;
            if (cellValue === 'S') hasS = true;
        }
    }

    const sendButton = document.getElementById('sendDataButton');
    sendButton.disabled = !(hasE && hasS);
}

function sendData() {
    const table = document.getElementById('dynamicTable');
    const rows = table.rows;
    const data = [];
    let entrada = null, saida = null;

    for (let i = 0; i < rows.length; i++) {
        const rowData = [];
        for (let j = 0; j < rows[i].cells.length; j++) {
            const value = rows[i].cells[j].textContent;
            rowData.push(value);

            if (value === 'E') entrada = [i, j];
            if (value === 'S') saida = [i, j];
        }
        data.push(rowData);
    }

    fetch('/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tabela: data, entrada, saida })
    })
    .then(response => response.json())
    .then(data => {
        clearError(); // Limpa mensagens de erro anteriores

        if (data.caminho) {
            let resultDiv = document.querySelector('.result-container');
            
            if (!resultDiv) {
                resultDiv = document.createElement('div');
                resultDiv.className = "result-container";
                document.body.appendChild(resultDiv);
            }

            const formattedPath = data.caminho.map(pair => `[${pair[0]},${pair[1]}]`).join(' ');
            resultDiv.innerHTML = `<h2>Solução:</h2><p>${formattedPath}</p>`;

            lastSolution = data.caminho;
            highlightPath(data.caminho);
        } else if (data.error) {
            showError(data.error); // Exibe o erro na interface
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showError('Ocorreu um erro ao processar a solicitação.');
    });
}

function showError(message) {
    clearSolution();
    let errorDiv = document.querySelector('.error-container');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-container';
        errorDiv.style.color = 'red';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.marginTop = '20px';
        document.body.appendChild(errorDiv);
    }

    errorDiv.innerHTML = `<p>${message}</p>`;
}

function clearError() {
    const errorDiv = document.querySelector('.error-container');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function clearSolution() {
    const resultDiv = document.querySelector('.result-container');
    if (resultDiv) {
        resultDiv.remove();
    }
}

function highlightPath(path) {
    const table = document.getElementById('dynamicTable');
    path.forEach(([row, col]) => {
        const cell = table.rows[row].cells[col];
        if (cell.textContent === '') {
            cell.classList.add('path');
        }
    });
}

function clearPath() {
    if (lastSolution) {
        const table = document.getElementById('dynamicTable');
        lastSolution.forEach(([row, col]) => {
            const cell = table.rows[row].cells[col];
            cell.classList.remove('path');
        });
        lastSolution = null;
    }
}

function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') return value;
    }
    return '';
}