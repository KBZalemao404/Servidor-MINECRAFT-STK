// ===============================================
// ARQUIVO: script.js
// FUNÇÃO: Checar o status do servidor Minecraft
// ===============================================

// ** ENDEREÇO DO SERVIDOR Aternos **
const SERVER_IP = "WILLzzin.aternos.me"; 

// Captura os elementos HTML pelos seus IDs
const statusIndicador = document.getElementById('status-indicador');
const playerCount = document.getElementById('player-count');
const serverIPDisplay = document.getElementById('server-ip');

// Define o IP no display
serverIPDisplay.textContent = SERVER_IP + ':25565'; 

/**
 * Função principal para buscar e exibir o status do servidor.
 */
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
            statusIndicador.className = 'status error'; // Usando a classe 'error' para consistência
            playerCount.textContent = 'N/A';
        });
}

// Inicia a checagem e configura o intervalo
checkServerStatus();
setInterval(checkServerStatus, 30000); 

// ===============================================
// FIM DO ARQUIVO: script.js
// ===============================================
