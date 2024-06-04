// Initialize Firebase with service account credentials
const firebaseConfig = {
    type: "service_account",
    project_id: "fshell",
    private_key_id: "c4e2dc4b03e1332eddffee65a5cc17444abc02b0",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKPfKdrna3atlc\n74LD1gC/f3AMfncpch/wzw03d/9eTXQ892MuonagCtSuzkQ1OPkSXl/dWS3Nm5qG\nmQyqqdBF2uxSoSe6oK6sWMESfShDlJJx8Up/4GQwyL933wUZWov3NJaK7erSZWVA\n8r0pAlgeHt5ZUw/Sx5L8KJjls55m5oWu1OH1rIjjywbBQsCY8RPNCJyoJrOokBoD\n26z6xrwnYj05sZo86UdHYdBi/WfjUziRj6ajjQdkk0h4sCOs9J/wuXM7NAdI+136\n9TQpLkadto+YhnkdAjOrQsXFdu9PYy4J7/FGevHsT+Nj+O2GHtT+Z3geQDOnC8SJ\nZ8VhMX21AgMBAAECggEAB2U5hHuXOsDM/wGBIiEmuNnzonlTaTATq+4eWRtpuqyR\nZhNTzKZDOTn8KgI/60RQk1PhJIp4ys54WZiqJml8RLmrL6BWABSVHpdGRCNQgBwk\nOMduhnuRnlkQ61S77n/po1oIcT8e+Z+cksHtmdzMlRli3xhS+U2z+cWQRcIKNlAB\n+Bet2EHmQYEdodVyvDsZw+wEqfr6mYyVRIA4ZmoGGwCxuv5/EWclg/h5waJeFkXx\nRCUnMr9K/1+q5j56GQ5cyJHBwnYjPyh0qxs9l2jqHfnVhd+W8nVqfFdbXH01Ob9z\nZ/1yT4e5ZguSO3qXHos+OQxGs/PeeGcBOABn0N9ENwKBgQD5k7UZxvkL/LXAsmBU\nlLtM+K1Jku1GsBbd3jVf5PQmtkM9j9nYek2mTsjaR+qdgBw2d9KadkKZg39sdMEw\nHpm5/JV/wga4IgsbwKSWOYfZBGbfLFrhOTHbNDNK2Q4LRcPIbZqD/1u7kwwMsHEm\nJdhH/H3wM2CvYkfB1jJDz+HhgwKBgQDPcmHbvNsQb0uht5oYg/y74LfFK1/tNTxr\nTNrQn2sEbXUE7lhdTe9VOLEh5CdG38RG1Ni7N1U+3AoOVpLjJ8GgC7DC5jNE3ZVR\nY9M9WkIedIQjm79mvxTgy+TxdZ2jXH9+dAYh6sUrKC7s3JGz64iJ4Od5eNUcFnX2\nvDjj+Y+WZwKBgQDFT0VJz8hs9akrYtpNhBhfzeoR1JrJ28T4Owive26afFXEgcmU\nH3zsEjUwfNK7GeE0Hp7dhsk4XIGM2PEyfb7DDzGSA28Ue7WUh0SXj3wa0iQSJBrl\nHDaSOj6i2d8Egm86MYyK9oMrVCGelo+dvSW0I6XdFIFHpsdcM18hxWOqyQKBgGhf\ntpjmppnYRYdyZ1faYLju0cekkTk6RdH+80FwVFn/8JawjUk0wyxvv7+7mX9xasHw\nqbNYnc1ozK52JKWiBSvPdfo59KW7jztKLKh71zSXjzyTSnQZxBluvRw3/z6IdaVc\nHxHFm7qhFysZtz19Tk+BFzXo8+CT9HpWLZGWqQYVAoGAfzecj+Ie+V6d7IeqOMkE\nBXH+9psKBelBexKkACnsgHPED3QjiTI1B+g0ObfEkfAUsbRIrycOlWSmDoTgvcWn\nfuC54q33l9/Ny3LU9MbYaAEs3HncYJGywdq61IfpNeIdUFWy9NAmblHBnX9SopgI\njPC7zEWhHAJrsUjI4X6nvdw=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-xx3n5@fshell.iam.gserviceaccount.com",
    client_id: "116473090420425210422",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xx3n5%40fshell.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};
firebase.initializeApp(firebaseConfig);

// Function to send a command to the server
function sendCommand() {
    const command = document.getElementById('commandInput').value.trim();

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

// Function to clear the database
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

// Function to read the output from the server
function readOutput() {
    const outputRef = firebase.database().ref('shell/output');

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

// Function to display output on the web page
function displayOutput(outputText) {
    const outputDiv = document.getElementById('output');
    const p = document.createElement('p');
    p.textContent = `Output: ${outputText}`;
    outputDiv.appendChild(p);
}

// Initial setup: listen for changes in output and read initially
readOutput();
firebase.database().ref('shell/output').on('child_added', () => readOutput());
