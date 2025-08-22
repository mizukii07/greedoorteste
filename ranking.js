// ranking.js - Sistema de Ranking para Green Door RPG

// Variáveis globais
let jogadoresRanking = [];
let jogadoresDestaque = [];
const emojisColocacao = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

// Inicialização do ranking
function inicializarRanking() {
    carregarDadosRanking();
    
    // Configurar event listeners para os filtros
    document.getElementById('filtro-posicao').addEventListener('change', filtrarRanking);
    document.getElementById('filtro-ordenacao').addEventListener('change', filtrarRanking);
}

// Carregar dados do Firebase
async function carregarDadosRanking() {
    try {
        const snapshot = await db.collection('fichas').get();
        jogadoresRanking = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const jogador = {
                id: doc.id,
                nome: data.nome || 'Sem nome',
                nickname: data.nickname || '',
                classe: data.classe || '',
                posicao: data.posicao || '',
                gols: parseInt(data.gols) || 0,
                assistencias: parseInt(data.assistencias) || 0,
                sg: parseInt(data.sg) || 0,
                avatar: data.avatar || '',
                userId: data.userId || '',
                // Calcular pontuação baseada em gols e assistências
                pontuacao: (parseInt(data.gols) || 0) * 2 + (parseInt(data.assistencias) || 0),
                // Flag para jogadores em destaque
                destaque: false
            };
            
            // Para defensores, adicionar SG à pontuação
            if (['goleiro', 'zagueiro', 'lateral_direito', 'lateral_esquerdo'].includes(jogador.posicao)) {
                jogador.pontuacao += jogador.sg;
            }
            
            jogadoresRanking.push(jogador);
        });
        
        // Ordenar jogadores por pontuação (critério principal)
        jogadoresRanking.sort((a, b) => b.pontuacao - a.pontuacao);
        
        // Aplicar destaques se existirem
        aplicarDestaques();
        
        exibirRanking(jogadoresRanking);
    } catch (error) {
        console.error('Erro ao carregar dados do ranking:', error);
        document.getElementById('ranking-list').innerHTML = `
            <div class="erro-carregamento">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar o ranking. Tente novamente.</p>
            </div>
        `;
    }
}

// Aplicar jogadores em destaque
function aplicarDestaques() {
    if (jogadoresDestaque.length > 0) {
        jogadoresRanking.forEach(jogador => {
            jogador.destaque = jogadoresDestaque.includes(jogador.id);
        });
        
        // Ordenar para que os destacados fiquem no topo
        jogadoresRanking.sort((a, b) => {
            if (a.destaque && !b.destaque) return -1;
            if (!a.destaque && b.destaque) return 1;
            return b.pontuacao - a.pontuacao;
        });
    }
}

// Exibir ranking na interface
function exibirRanking(jogadores) {
    const rankingList = document.getElementById('ranking-list');
    
    if (jogadores.length === 0) {
        rankingList.innerHTML = '<p class="sem-dados">Nenhum jogador encontrado.</p>';
        return;
    }
    
    let html = '';
    
    jogadores.forEach((jogador, index) => {
        const colocacao = index + 1;
        const emoji = colocacao <= 10 ? emojisColocacao[colocacao - 1] : '⚽';
        
        html += `
            <div class="jogador-ranking ${jogador.destaque ? 'destaque' : ''}" data-id="${jogador.id}">
                <div class="colocacao">
                    <span class="numero-colocacao">${colocacao}</span>
                    <span class="emoji-colocacao">${emoji}</span>
                </div>
                
                <div class="info-jogador">
                    <div class="avatar-jogador">
                        ${jogador.avatar ? 
                            `<img src="${jogador.avatar}" alt="${jogador.nickname || jogador.nome}">` : 
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div class="detalhes-jogador">
                        <h3>${jogador.nickname || jogador.nome}</h3>
                        <p>${jogador.classe} • ${mapaPosicoes[jogador.posicao] || 'Nenhuma'}</p>
                    </div>
                </div>
                
                <div class="estatisticas-jogador">
                    <div class="estatistica">
                        <i class="fas fa-futbol"></i>
                        <span>${jogador.gols}</span>
                    </div>
                    <div class="estatistica">
                        <i class="fas fa-shoe-prints"></i>
                        <span>${jogador.assistencias}</span>
                    </div>
                    ${['goleiro', 'zagueiro', 'lateral_direito', 'lateral_esquerdo'].includes(jogador.posicao) ? `
                    <div class="estatistica">
                        <i class="fas fa-shield-alt"></i>
                        <span>${jogador.sg}</span>
                    </div>
                    ` : ''}
                    <div class="pontuacao-total">
                        <span>${jogador.pontuacao} pts</span>
                    </div>
                </div>
                
                ${jogador.destaque ? `
                <div class="badge-destaque">
                    <i class="fas fa-star"></i>
                    Destaque
                </div>
                ` : ''}
            </div>
        `;
    });
    
    rankingList.innerHTML = html;
    
    // Adicionar animação de entrada
    setTimeout(() => {
        document.querySelectorAll('.jogador-ranking').forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('animate-in');
        });
    }, 100);
}

// Filtrar ranking
function filtrarRanking() {
    const posicaoFiltro = document.getElementById('filtro-posicao').value;
    const ordenacaoFiltro = document.getElementById('filtro-ordenacao').value;
    
    let jogadoresFiltrados = [...jogadoresRanking];
    
    // Aplicar filtro de posição
    if (posicaoFiltro !== 'todas') {
        if (posicaoFiltro === 'defensor') {
            jogadoresFiltrados = jogadoresFiltrados.filter(j => 
                ['goleiro', 'zagueiro', 'lateral_direito', 'lateral_esquerdo'].includes(j.posicao)
            );
        } else if (posicaoFiltro === 'meia') {
            jogadoresFiltrados = jogadoresFiltrados.filter(j => 
                ['volante', 'meia_ofensivo'].includes(j.posicao)
            );
        } else if (posicaoFiltro === 'atacante') {
            jogadoresFiltrados = jogadoresFiltrados.filter(j => 
                ['ponta_direita', 'ponta_esquerda', 'centroavante'].includes(j.posicao)
            );
        } else {
            jogadoresFiltrados = jogadoresFiltrados.filter(j => j.posicao === posicaoFiltro);
        }
    }
    
    // Aplicar ordenação
    if (ordenacaoFiltro === 'gols') {
        jogadoresFiltrados.sort((a, b) => b.gols - a.gols);
    } else if (ordenacaoFiltro === 'assistencias') {
        jogadoresFiltrados.sort((a, b) => b.assistencias - a.assistencias);
    } else if (ordenacaoFiltro === 'sg') {
        jogadoresFiltrados.sort((a, b) => b.sg - a.sg);
    } else {
        jogadoresFiltrados.sort((a, b) => b.pontuacao - a.pontuacao);
    }
    
    exibirRanking(jogadoresFiltrados);
}

// Selecionar jogadores em destaque
function selecionarDestaques() {
    // Implementar lógica para selecionar jogadores em destaque
    // Esta função pode abrir um modal para seleção ou usar outra interface
    
    // Exemplo simples (apenas para demonstração)
    const jogadorId = prompt("Digite o ID do jogador para destacar:");
    if (jogadorId && jogadoresRanking.find(j => j.id === jogadorId)) {
        if (!jogadoresDestaque.includes(jogadorId)) {
            jogadoresDestaque.push(jogadorId);
            aplicarDestaques();
            exibirRanking(jogadoresRanking);
            alert("Jogador destacado com sucesso!");
        } else {
            alert("Este jogador já está em destaque!");
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na seção de ranking
    if (document.getElementById('secao-ranking')) {
        inicializarRanking();
    }
});

// Função para ser chamada quando a aba de ranking for aberta
function mostrarRanking() {
    inicializarRanking();
}
