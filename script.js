// ===============================================
// ARQUIVO: script.js
// FUNÇÃO: Checar o status do servidor Minecraft E Controlar Abas
// ===============================================

// ** ENDEREÇO DO SERVIDOR Aternos **
const SERVER_IP = "WILLzzin.aternos.me"; 

// Captura os elementos HTML pelos seus IDs
const statusIndicador = document.getElementById('status-indicador');
const playerCount = document.getElementById('player-count');
const serverIPDisplay = document.getElementById('server-ip');

// Define o IP no display
serverIPDisplay.textContent = SERVER_IP + ':25565'; 

// ===============================================
// 1. Lógica de Checagem de Status
// ===============================================

function checkServerStatus() {
    const API_URL = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

    // 1. Define o estado inicial como "Carregando"
    statusIndicador.textContent = "Verificando...";
    statusIndicador.className = 'status loading';
    playerCount.textContent = '...';

    // 2. Faz a chamada HTTP assíncrona para a API
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na API de Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 3. Processa os dados
            if (data.online) {
                const players = data.players.online || 0;
                
                statusIndicador.textContent = "ONLINE";
                statusIndicador.className = 'status online';
                playerCount.textContent = players;
            } else {
                // Servidor está OFFLINE
                statusIndicador.textContent = "OFFLINE";
                statusIndicador.className = 'status offline';
                playerCount.textContent = '0';
            }
        })
        .catch(error => {
            // 4. Trata erros
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
// 2. Lógica de Troca de Abas (AGORA FUNCIONA)
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    function showSection(targetId) {
        // Oculta todas as seções
        contentSections.forEach(section => {
            section.style.display = 'none';
        });

        // Mostra a seção alvo (usando o ID do link, ex: #loja)
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o salto padrão da página

            // Remove a classe 'active' de todos os itens de navegação
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Adiciona a classe 'active' ao item clicado
            item.classList.add('active');

            // Troca a seção de conteúdo
            const targetId = item.getAttribute('href'); 
            showSection(targetId);
        });
    });

    // Inicialização: Garante que a seção "SERVIDOR" (ativa por padrão no HTML) esteja visível
    const initialActiveItem = document.querySelector('.nav-item.active');
    if (initialActiveItem) {
        showSection(initialActiveItem.getAttribute('href'));
    }
});
