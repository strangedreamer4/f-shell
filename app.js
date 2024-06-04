console.log("Firebase initialized");

// Send command function
function sendCommand() {
    const command = document.getElementById('commandInput').value.trim();
    console.log('Command to be sent:', command);

    if (!command) {
        alert('Please enter a command.');
        return;
    }

    const commandsRef = firebase.database().ref('shell/commands');
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

// Clear database function
function clearDatabase() {
    const confirmClear = confirm('Are you sure you want to clear the database? This action cannot be undone.');
    if (!confirmClear) return;

    const shellRef = firebase.database().ref('shell');
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

// Read output function
function readOutput() {
    const outputRef = firebase.database().ref('shell/output');
    console.log('Reading output...');

    outputRef.once('value', snapshot => {
        const output = snapshot.val();
        console.log('Output:', output);

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

// Display output function
function displayOutput(outputText) {
    const outputDiv = document.getElementById('output');
    const p = document.createElement('p');
    p.textContent = `Output: ${outputText}`;
    outputDiv.appendChild(p);
}

// Listen for changes in output and read initially
readOutput();
firebase.database().ref('shell/output').on('child_added', () => readOutput());
