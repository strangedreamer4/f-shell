const db = firebase.database();

document.getElementById('sendCommand').addEventListener('click', sendCommand);
document.getElementById('clearDatabase').addEventListener('click', clearDatabase);

function sendCommand() {
    const command = document.getElementById('commandInput').value;
    console.log(`Sending command: ${command}`);
    
    if (command.toLowerCase() === 'exit' || command.toLowerCase() === 'quit') {
        console.log('Exit or quit command received.');
        return;
    } else if (command.toLowerCase() === '04') {
        clearDatabase();
        console.log('Clear database command received.');
        return;
    }

    const commandsRef = db.ref('shell/commands');
    commandsRef.push().set({ 'command': command })
        .then(() => {
            console.log('Command sent successfully.');
            checkOutput();
        })
        .catch(error => {
            console.error('Error sending command:', error);
        });
}

function clearDatabase() {
    const shellRef = db.ref('shell');
    shellRef.remove()
        .then(() => {
            console.log('Database cleared successfully.');
        })
        .catch(error => {
            console.error('Error clearing database:', error);
        });
}

function checkOutput() {
    const outputRef = db.ref('shell/output');
    outputRef.on('value', (snapshot) => {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';
        const output = snapshot.val();
        console.log('Checking output:', output);
        
        if (output) {
            for (const key in output) {
                const value = output[key];
                const outputText = value.output ? value.output : value;
                const p = document.createElement('p');
                p.textContent = `Output: ${outputText}`;
                outputDiv.appendChild(p);

                // Remove the output once read
                db.ref(`shell/output/${key}`).remove()
                    .then(() => {
                        console.log('Output removed successfully.');
                    })
                    .catch(error => {
                        console.error('Error removing output:', error);
                    });
            }
        } else {
            const p = document.createElement('p');
            p.textContent = 'No output received.';
            outputDiv.appendChild(p);
        }
    });
}
