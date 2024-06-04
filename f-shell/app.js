const db = firebase.database();

document.getElementById('sendCommand').addEventListener('click', sendCommand);
document.getElementById('clearDatabase').addEventListener('click', clearDatabase);

function sendCommand() {
    const command = document.getElementById('commandInput').value;
    if (command.toLowerCase() === 'exit' || command.toLowerCase() === 'quit') {
        return;
    } else if (command.toLowerCase() === '04') {
        clearDatabase();
        return;
    }

    const commandsRef = db.ref('shell/commands');
    commandsRef.push().set({ 'command': command });

    checkOutput();
}

function clearDatabase() {
    const shellRef = db.ref('shell');
    shellRef.remove();
}

function checkOutput() {
    const outputRef = db.ref('shell/output');
    outputRef.on('value', (snapshot) => {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';
        const output = snapshot.val();
        if (output) {
            for (const key in output) {
                const value = output[key];
                const outputText = value.output ? value.output : value;
                const p = document.createElement('p');
                p.textContent = `Output: ${outputText}`;
                outputDiv.appendChild(p);

                // Remove the output once read
                db.ref(`shell/output/${key}`).remove();
            }
        } else {
            const p = document.createElement('p');
            p.textContent = 'No output received.';
            outputDiv.appendChild(p);
        }
    });
}
