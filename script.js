// ===============================================
// ARQUIVO: script.js
// FUNÇÃO: Status do Servidor, Troca de Abas e Autenticação Firebase
// ===============================================

// ** Variáveis do Servidor **
const SERVER_IP = "WILLzzin.aternos.me"; 
const statusIndicador = document.getElementById('status-indicador');
const playerCount = document.getElementById('player-count');
const serverIPDisplay = document.getElementById('server-ip');

serverIPDisplay.textContent = SERVER_IP + ':25565'; 

// ** Variáveis de Autenticação **
const auth = firebase.auth();
const authMessage = document.getElementById('auth-message');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnLogout = document.getElementById('btn-logout');
const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');
const userInfoDiv = document.getElementById('user-info');
const authUiDiv = document.getElementById('auth-ui');
const userEmailDisplay = document.getElementById('user-email-display');


// ===============================================
// 1. Lógica de Checagem de Status
// ===============================================

function checkServerStatus() {
    const API_URL = `https://api.mcsrvstat.us/2/${SERVER_IP}`;
    statusIndicador.textContent = "Verificando...";
    statusIndicador.className = 'status loading';
    playerCount.textContent = '...';

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.online) {
                const players = data.players.online || 0;
                statusIndicador.textContent = "ONLINE";
                statusIndicador.className = 'status online';
                playerCount.textContent = players;
            } else {
                statusIndicador.textContent = "OFFLINE";
                statusIndicador.className = 'status offline';
                playerCount.textContent = '0';
            }
        })
        .catch(error => {
            console.error("Erro ao buscar status:", error);
            statusIndicador.textContent = "ERRO DE CONEXÃO";
            statusIndicador.className = 'status error'; 
            playerCount.textContent = 'N/A';
        });
}

// Inicia a checagem e configura o intervalo
checkServerStatus();
setInterval(checkServerStatus, 30000); 


// ===============================================
// 2. Lógica de Troca de Abas (Menu)
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    function showSection(targetId) {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); 

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const targetId = item.getAttribute('href'); 
            showSection(targetId);
        });
    });

    // Inicialização
    const initialActiveItem = document.querySelector('.nav-item.active');
    if (initialActiveItem) {
        showSection(initialActiveItem.getAttribute('href'));
    }
});


// ===============================================
// 3. Lógica de Autenticação (Firebase)
// ===============================================

function displayMessage(message, isError = true) {
    authMessage.textContent = message;
    authMessage.style.color = isError ? 'var(--color-danger)' : 'var(--color-success)';
}

// Handler de Registro
btnRegister.addEventListener('click', () => {
    const email = authEmailInput.value;
    const password = authPasswordInput.value;
    
    displayMessage("Processando...", false);

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            displayMessage(`Registro bem-sucedido! Bem-vindo(a), ${userCredential.user.email}`, false);
        })
        .catch((error) => {
            displayMessage(`Erro no Registro: ${error.message}`, true);
        });
});

// Handler de Login
btnLogin.addEventListener('click', () => {
    const email = authEmailInput.value;
    const password = authPasswordInput.value;

    displayMessage("Processando...", false);

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            displayMessage(`Login bem-sucedido!`, false);
        })
        .catch((error) => {
            displayMessage(`Erro no Login: ${error.message}`, true);
        });
});

// Handler de Logout
btnLogout.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            displayMessage("Você saiu da conta.", false);
        })
        .catch((error) => {
            displayMessage(`Erro ao sair: ${error.message}`, true);
        });
});

// Monitorar o Estado da Autenticação (Atualiza a UI)
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuário logado
        authUiDiv.style.display = 'none';
        userInfoDiv.style.display = 'block';
        userEmailDisplay.textContent = user.email;
        authMessage.textContent = ''; 
    } else {
        // Usuário deslogado
        authUiDiv.style.display = 'block';
        userInfoDiv.style.display = 'none';
        userEmailDisplay.textContent = '';
    }
});
