const db = firebase.database();

document.getElementById('sendCommand').addEventListener('click', sendCommand);
document.getElementById('clearDatabase').addEventListener('click', clearDatabase);

function sendCommand() {
    const command = document.getElementById('commandInput').value.trim();
    if (!command) {
        alert('Please enter a command.');
        return;
    }

    const commandsRef = db.ref('shell/commands');
    commandsRef.push({ command })
        .then(() => {
            console.log('Command sent successfully.');
            document.getElementById('commandInput').value = ''; // Clear input field
        })
        .catch(error => {
            console.error('Error sending command:', error);
            alert('Error sending command. Please try again.');
        });
}

function clearDatabase() {
    const confirmClear = confirm('Are you sure you want to clear the database? This action cannot be undone.');
    if (!confirmClear) return;

    const shellRef = db.ref('shell');
    shellRef.remove()
        .then(() => {
            console.log('Database cleared successfully.');
            document.getElementById('output').innerHTML = ''; // Clear output display
        })
        .catch(error => {
            console.error('Error clearing database:', error);
            alert('Error clearing database. Please try again.');
        });
}

function readOutput() {
    const outputRef = db.ref('shell/output');
    outputRef.once('value', snapshot => {
        const output = snapshot.val();
        if (output) {
            for (const key in output) {
                const { output: outputText } = output[key];
                displayOutput(outputText);
                outputRef.child(key).remove(); // Remove output after displaying
            }
        } else {
            displayOutput('No output received.');
        }
    }, error => {
        console.error('Error reading output:', error);
        alert('Error reading output. Please try again.');
    });
}

function displayOutput(outputText) {
    const outputDiv = document.getElementById('output');
    const p = document.createElement('p');
    p.textContent = `Output: ${outputText}`;
    outputDiv.appendChild(p);
}

// Read output initially and then listen for changes
readOutput();
db.ref('shell/output').on('child_added', () => readOutput());
