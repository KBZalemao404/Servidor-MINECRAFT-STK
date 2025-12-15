// ===============================================
// ARQUIVO: script.js
// FUNÇÃO: Checar o status do servidor Minecraft
// ===============================================

// ** O ENDEREÇO DO SEU SERVIDOR Aternos está aqui. **
const SERVER_IP = "WILLzzin.aternos.me"; 

// Captura os elementos HTML pelos seus IDs
const statusIndicador = document.getElementById('status-indicador');
const playerCount = document.getElementById('player-count');
const serverIPDisplay = document.getElementById('server-ip');

// Define o IP no display (mostra o endereço completo no HTML)
serverIPDisplay.textContent = SERVER_IP + ':25565'; 

/**
 * Função principal para buscar e exibir o status do servidor.
 */
function checkServerStatus() {
    // A API externa mcsrvstat.us é usada para contornar a necessidade de um back-end.
    const API_URL = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

    // 1. Define o estado inicial como "Carregando"
    statusIndicador.textContent = "Verificando...";
    statusIndicador.className = 'status loading';
    playerCount.textContent = '...';

    // 2. Faz a chamada HTTP assíncrona para a API
    fetch(API_URL)
        .then(response => {
            // Garante que a resposta da rede foi OK (status 200-299)
            if (!response.ok) {
                // Se a API externa falhar, tratamos como um erro de rede
                throw new Error(`Erro na API de Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 3. Processa os dados
            if (data.online) {
                // Servidor está ONLINE
                const players = data.players.online || 0;
                
                statusIndicador.textContent = "ONLINE";
                statusIndicador.className = 'status online';
                playerCount.textContent = players;
            } else {
                // Servidor está OFFLINE (ou Aternos está desligado)
                statusIndicador.textContent = "OFFLINE";
                statusIndicador.className = 'status offline';
                playerCount.textContent = '0';
            }
        })
        .catch(error => {
            // 4. Trata qualquer erro (falha de rede, IP inválido, etc.)
            console.error("Erro ao buscar status:", error);
            statusIndicador.textContent = "ERRO DE CONEXÃO";
            statusIndicador.className = 'status offline'; 
            playerCount.textContent = 'N/A';
        });
}

// Inicia a checagem do status imediatamente ao carregar a página
checkServerStatus();

// Configura para checar novamente a cada 30 segundos (30000 milissegundos)
setInterval(checkServerStatus, 30000); 

// ===============================================
// FIM DO ARQUIVO: script.js
// ===============================================