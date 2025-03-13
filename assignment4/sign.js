
// Reference 1: Used DOM manipulation techniques from https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
// Reference 2: Integrated p5.js with HTML elements using methods from https://p5js.org/reference/#/p5/createInput

document.getElementById('enterButton').addEventListener('click', function() {
    let name = document.getElementById('nameInput').value.trim();
    if (name) {
        showMessageAndFireworks(`Welcome ${name}!`, name);
        addToTable(name);
    }
});

function showMessageAndFireworks(message, name) {
    let messageDiv = document.getElementById('welcomeMessage');
    messageDiv.innerText = message;
    
    // Trigger fireworks only on button click
    setTimeout(() => {
        messageDiv.innerText = '';
    }, 3000);
    
    setTimeout(() => {
        createTriangles(windowWidth / 2, windowHeight / 2);
    }, 0);
}

function addToTable(name) {
    let tableBody = document.querySelector('#nameTable tbody');
    let row = document.createElement('tr');
    let nameCell = document.createElement('td');
    let actionCell = document.createElement('td');
    let deleteBtn = document.createElement('button');

    nameCell.innerText = name;
    deleteBtn.innerText = 'Delete';
    deleteBtn.className = 'deleteBtn';
    deleteBtn.onclick = function() {
        showMessageAndFireworks(`See you ${name}!`, name);
        row.remove();
    };

    actionCell.appendChild(deleteBtn);
    row.appendChild(nameCell);
    row.appendChild(actionCell);
    tableBody.appendChild(row);
}
