// ** ATENÇÃO: SUBSTITUA PELO SEU IP DE SERVIDOR REAL **
const SERVER_IP = "SEU_IP_DO_SERVIDOR"; // Ex: 'play.meuserver.com.br'

const statusIndicador = document.getElementById('status-indicador');
const playerCount = document.getElementById('player-count');
const serverIPDisplay = document.getElementById('server-ip');

// Define o IP no display
serverIPDisplay.textContent = SERVER_IP + ':25565'; 

function checkServerStatus() {
    // Usamos a API pública mcsrvstat.us para evitar problemas de CORS/Back-end
    const API_URL = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

    // 1. Define como "Carregando"
    statusIndicador.textContent = "Verificando...";
    statusIndicador.className = 'status loading';
    playerCount.textContent = '...';

    // 2. Faz a chamada da API
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro de rede: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos:", data); // Para debug

            // 3. Verifica se está online
            if (data.online) {
                const players = data.players.online;
                
                statusIndicador.textContent = "ONLINE";
                statusIndicador.className = 'status online';
                playerCount.textContent = players;
            } else {
                // 4. Se não estiver online
                statusIndicador.textContent = "OFFLINE";
                statusIndicador.className = 'status offline';
                playerCount.textContent = '0';
            }
        })
        .catch(error => {
            // 5. Trata erros (API fora do ar, IP errado, etc.)
            console.error("Erro ao buscar status:", error);
            statusIndicador.textContent = "ERRO DE CONEXÃO";
            statusIndicador.className = 'status offline'; // Tratar erro como offline para o usuário
            playerCount.textContent = 'N/A';
        });
}

// Executa a função na carga da página e a cada 30 segundos
checkServerStatus();
setInterval(checkServerStatus, 30000);