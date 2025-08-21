const bonusAltura = {
  '1.50-1.55': { drible: 3, explosao: 2, reflexos: 2, cabeceio: -3, intimidacao: -2, defesa: -2 },
  '1.56-1.60': { drible: 2, explosao: 2, reflexos: 2, cabeceio: -3, intimidacao: -2, defesa: -1 },
  '1.61-1.65': { drible: 2, explosao: 1, reflexos: 2, cabeceio: -2, intimidacao: -1, defesa: -1 },
  '1.66-1.70': { drible: 2, explosao: 1, reflexos: 1, cabeceio: -2, defesa: -1 },
  '1.71-1.75': { drible: 1, reflexos: 1, cabeceio: -1 },
  '1.76-1.80': {},
  '1.81-1.85': { cabeceio: 1, intimidacao: 1, defesa: 1, explosao: -1 },
  '1.86-1.90': { cabeceio: 2, intimidacao: 1, defesa: 2, explosao: -2 },
  '1.91-1.95': { cabeceio: 2, intimidacao: 2, defesa: 2, explosao: -2, drible: -1 },
  '1.96-2.00': { cabeceio: 3, intimidacao: 2, defesa: 3, explosao: -3, drible: -2, reflexos: -1 },
  '2.01-2.05': { cabeceio: 3, intimidacao: 3, defesa: 4, explosao: -4, drible: -2, reflexos: -2 }
};

const bonusPeso = {
  '50-55': { explosao: 3, acrobacia: 2, furtividade: 2, reflexos: 1, corpo: -3, intimidacao: -2, defesa: -2 },
  '56-60': { explosao: 2, acrobacia: 2, furtividade: 1, reflexos: 1, corpo: -3, intimidacao: -2, defesa: -1 },
  '61-65': { explosao: 2, acrobacia: 1, furtividade: 1, reflexos: 1, corpo: -2, intimidacao: -1 },
  '66-70': { explosao: 2, acrobacia: 1, reflexos: 1, corpo: -2 },
  '71-75': {},
  '76-80': { corpo: 1, chute: 1, defesa: 1, explosao: -1 },
  '81-85': { corpo: 2, chute: 1, defesa: 1, explosao: -2, reflexos: -1 },
  '86-90': { corpo: 2, chute: 2, defesa: 2, explosao: -2, reflexos: -1 },
  '91-95': { corpo: 3, chute: 2, defesa: 3, explosao: -3, reflexos: -2 },
  '96-100': { corpo: 3, chute: 3, defesa: 4, explosao: -4, reflexos: -2, drible: -1 }
};

function getBonus(value, table) {
  const numValue = Number(value);
  if (isNaN(numValue)) return {};
  
  for (const range in table) {
    const [minStr, maxStr] = range.split('-');
    const min = Number(minStr);
    const max = Number(maxStr);
    
    if (numValue >= min && numValue <= max) {
      return table[range] || {};
    }
  }
  return {};
}

const mapaPosicoes = {
  'goleiro': 'Goleiro',
  'zagueiro': 'Zagueiro',
  'lateral_direito': 'Lateral Direito',
  'lateral_esquerdo': 'Lateral Esquerdo',
  'volante': 'Volante',
  'meia_ofensivo': 'Meia Ofensivo',
  'ponta_direita': 'Ponta Direita',
  'ponta_esquerda': 'Ponta Esquerda',
  'centroavante': 'Centroavante',
  'nenhuma': 'Nenhuma'
};

const mapaTimes = {
  'v1': 'Time V1',
  'w1': 'Time W1',
  'x1': 'Time X1',
  'y1': 'Time Y1',
  'z1': 'Time Z1',
  'v2': 'Time V2',
  'w2': 'Time W2',
  'x2': 'Time X2',
  'y2': 'Time Y2',
  'z2': 'Time Z2'
};

const mapaPericias = {
  corpo: "Corpo a Corpo",
  cabeceio: "Cabeceio",
  chute: "Chute",
  passe: "Passe",
  drible: "Drible/Finta",
  dominio: "Domínio",
  pontaria: "Pontaria",
  roubo: "Roubo de Bola",
  corrida: "Corrida Longa Distância",
  explosao: "Explosão",
  reflexos: "Reflexos",
  defesa: "Defesa",
  furtividade: "Furtividade",
  acrobacia: "Acrobacia",
  intimidacao: "Intimidação",
  presenca: "Presença",
  enganacao: "Enganação",
  diplomacia: "Diplomacia",
  intuicao: "Intuição"
};

let escolhaAmbidestro = '';
let fichaId = '';
let isAdmin = false;
let fichasUsuario = [];
let fichaParaExcluir = null;
let habilidades = [];
let editandoHabilidadeIndex = -1;

function verificarImagens() {
  const loader = document.getElementById('loader');
  const logo = document.getElementById('header-logo');
  
  if (!logo) {
    loader.style.display = 'none';
    return;
  }
  
  const fallbackTimeout = setTimeout(() => {
    loader.style.display = 'none';
    if (logo) logo.removeEventListener('load', onLogoLoad);
    if (logo) logo.removeEventListener('error', onLogoError);
  }, 3000);

  function onLogoLoad() {
    clearTimeout(fallbackTimeout);
    setTimeout(() => {
      loader.style.display = 'none';
      if (logo) logo.removeEventListener('load', onLogoLoad);
      if (logo) logo.removeEventListener('error', onLogoError);
    }, 1000);
  }

  function onLogoError() {
    clearTimeout(fallbackTimeout);
    setTimeout(() => {
      loader.style.display = 'none';
      if (logo) logo.removeEventListener('load', onLogoLoad);
      if (logo) logo.removeEventListener('error', onLogoError);
    }, 1000);
  }

  if (logo.complete) {
    if (logo.naturalHeight !== 0) {
      onLogoLoad();
    } else {
      onLogoError();
    }
  } else {
    logo.addEventListener('load', onLogoLoad);
    logo.addEventListener('error', onLogoError);
  }
}

function atualizarBarraFolego() {
  const atual = parseInt(document.getElementById('folego-atual').value) || 0;
  const total = parseInt(document.getElementById('folego-total').value) || 1;
  const porcentagem = total > 0 ? Math.min(100, (atual / total) * 100) : 0;
  const barra = document.getElementById('barra-folego');
  
  barra.style.width = `${porcentagem}%`;
  
  const statusVazio = document.getElementById('folego-vazio');
  const statusMetade = document.getElementById('folego-metade');
  const statusCheio = document.getElementById('folego-cheio');
  
  statusVazio.style.color = '';
  statusMetade.style.color = '';
  statusCheio.style.color = '';
  
  if (atual <= 0) {
    statusVazio.style.color = '#ff0000';
    statusVazio.style.fontWeight = 'bold';
  } else if (atual <= Math.floor(total / 2)) {
    statusMetade.style.color = '#ffcc00';
    statusMetade.style.fontWeight = 'bold';
  } else {
    statusCheio.style.color = '#00ff00';
    statusCheio.style.fontWeight = 'bold';
  }
}

function calcularPericias() {
  const altura = parseFloat(document.getElementById('altura').value) || 1.75;
  const peso = parseInt(document.getElementById('peso').value) || 70;
  const perna = document.getElementById('perna').value;
  const posicao = document.getElementById('posicao').value;
  const folegoAtual = parseInt(document.getElementById('folego-atual').value) || 0;
  const folegoTotal = parseInt(document.getElementById('folego-total').value) || 10;

  const bonusA = getBonus(altura, bonusAltura);
  const bonusP = getBonus(peso, bonusPeso);

  function ajustarDefesa(bonus) {
    if (posicao !== 'goleiro') {
      if (bonus.defesa && (altura >= 1.86 || peso >= 86)) {
        bonus.defesa = Math.floor(bonus.defesa / 2);
      }
    }
    return bonus;
  }

  const bonusAjustadoA = ajustarDefesa({...bonusA});
  const bonusAjustadoP = ajustarDefesa({...bonusP});

  atualizarBarraFolego();
  
  let staminaPenalty = 1;
  let staminaClass = '';
  
  if (folegoAtual <= 0) {
    staminaPenalty = 0;
    staminaClass = 'no-stamina';
  } else if (folegoAtual <= 10) {
    staminaPenalty = 0.5;
    staminaClass = 'low-stamina';
  }

  document.querySelectorAll('.pericia-item').forEach(item => {
    item.classList.remove('low-stamina', 'no-stamina');
    if (staminaClass) {
      item.classList.add(staminaClass);
    }
    
    const periciaId = item.querySelector('.pericia-manual').dataset.pericia;
    const card = item.closest('.card-atributo');
    const atributoId = card.querySelector('.atributo-input').id;
    const valorAtributo = parseInt(document.getElementById(atributoId).value) || 0;

    let valor = Math.floor(valorAtributo / 2);

    if (bonusAjustadoA[periciaId]) valor += bonusAjustadoA[periciaId];
    if (bonusAjustadoP[periciaId]) valor += bonusAjustadoP[periciaId];

    if (perna === 'ambidestro') {
      if (['passe','drible','dominio','roubo'].includes(periciaId)) {
        valor += 5;
      }
      if ((periciaId === 'pontaria' && escolhaAmbidestro === 'pontaria') || 
          (periciaId === 'chute' && escolhaAmbidestro === 'chute')) {
        valor += 5;
      }
    }

    const pontosManuais = parseInt(item.querySelector('.pericia-manual').value) || 0;
    let valorTotal = valor + pontosManuais;

    if (folegoAtual <= 0) {
      valorTotal = 0;
    } else if (staminaPenalty === 0.5) {
      valorTotal = Math.floor(valorTotal * staminaPenalty);
    }

    item.querySelector('.pericia-total').textContent = valorTotal;
  });

  const velocidade = parseInt(document.getElementById('velocidade').value) || 0;
  let deslocamentoFinal = 10 + velocidade;
  
  if (folegoAtual <= 0) {
    deslocamentoFinal = 0;
  } else if (staminaPenalty === 0.5) {
    deslocamentoFinal = Math.floor(deslocamentoFinal * 0.5);
  }
  
  document.getElementById('deslocamento').value = deslocamentoFinal;
}

function atualizarCamposPosicao() {
  const posicao = document.getElementById('posicao').value;
  const sgContainer = document.getElementById('sg-container');
  
  if (['goleiro', 'zagueiro', 'lateral_direito', 'lateral_esquerdo'].includes(posicao)) {
    sgContainer.style.display = 'block';
  } else {
    sgContainer.style.display = 'none';
  }
}

document.getElementById('avatar-input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = document.getElementById('avatar-img');
      img.src = event.target.result;
      img.style.display = 'block';
      document.querySelector('.avatar span').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('perna').addEventListener('change', function() {
  if (this.value === 'ambidestro' && !escolhaAmbidestro) {
    document.getElementById('modal-ambidestro').style.display = 'flex';
  } else {
    calcularPericias();
  }
});

function escolherAmbidestro(escolha) {
  escolhaAmbidestro = escolha;
  document.getElementById('modal-ambidestro').style.display = 'none';
  calcularPericias();
}

function mostrarSecao(secao) {
  document.querySelectorAll('.conteudo > div').forEach(el => {
    el.style.display = 'none';
  });
  
  document.getElementById(`secao-${secao}`).style.display = 'block';
  
  document.querySelectorAll('nav a').forEach(item => {
    item.classList.remove('ativo');
  });
  document.querySelector(`nav a[onclick="mostrarSecao('${secao}')"]`).classList.add('ativo');
  
  if (secao === 'mestre') {
    verificarAdmin();
  }
  
  if (secao === 'ficha' && fichaId) {
    document.getElementById('btn-excluir').style.display = 'block';
  } else {
    document.getElementById('btn-excluir').style.display = 'none';
  }
}

async function verificarEMostrarMenuAdmin() {
  const user = auth.currentUser;
  const menuMestre = document.querySelector('nav a[onclick="mostrarSecao(\'mestre\')"]').parentElement;
  
  if (!user) {
    menuMestre.style.display = 'none';
    return;
  }
  
  try {
    const adminDoc = await db.collection('admins').doc(user.uid).get();
    isAdmin = adminDoc.exists;
    
    if (isAdmin) {
      menuMestre.style.display = 'list-item';
    } else {
      menuMestre.style.display = 'none';
    }
  } catch (error) {
    console.error('Erro ao verificar admin para menu:', error);
    menuMestre.style.display = 'none';
  }
}

async function verificarAdmin() {
  const user = auth.currentUser;
  const adminMessage = document.getElementById('admin-message');
  
  if (!user) {
    adminMessage.style.display = 'block';
    adminMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Faça login para acessar o Painel do Mestre';
    return;
  }
  
  try {
    const adminDoc = await db.collection('admins').doc(user.uid).get();
    isAdmin = adminDoc.exists;
    
    if (isAdmin) {
      adminMessage.style.display = 'none';
      carregarFichasParaMestre();
    } else {
      adminMessage.style.display = 'block';
      adminMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Acesso restrito a administradores';
    }
  } catch (error) {
    console.error('Erro ao verificar admin:', error);
    adminMessage.style.display = 'block';
    adminMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro ao verificar permissões';
  }
}

async function salvarFicha() {
  const user = auth.currentUser;
  if (!user) {
    abrirLogin();
    alert('Você precisa fazer login para salvar sua ficha!');
    return;
  }
  
  const ficha = {
    nickname: document.getElementById('nickname').value || '',
    nome: document.getElementById('nome').value,
    idade: document.getElementById('idade').value,
    classe: document.getElementById('classe').value,
    posicao: document.getElementById('posicao').value,
    posicao_secundaria: document.getElementById('posicao_secundaria').value,
    altura: document.getElementById('altura').value,
    peso: document.getElementById('peso').value,
    perna: document.getElementById('perna').value,
    escolhaAmbidestro: escolhaAmbidestro,
    dom: document.getElementById('dom').value,
    folegoAtual: parseInt(document.getElementById('folego-atual').value) || 0,
    folegoTotal: parseInt(document.getElementById('folego-total').value) || 10,
    gols: document.getElementById('gols').value,
    assistencias: document.getElementById('assistencias').value,
    sg: document.getElementById('sg').value,
    deslocamento: document.getElementById('deslocamento').value,
    time: document.getElementById('time').value,
    avatar: document.getElementById('avatar-img').src || '',
    habilidades: habilidades,
    pericias: {}
  };

  const atributos = ['potencia', 'tecnica', 'velocidade', 'agilidade', 'ego'];
  atributos.forEach(attr => {
    ficha[attr] = parseInt(document.getElementById(attr).value) || 0;
  });

  document.querySelectorAll('.pericia-item').forEach(item => {
    const periciaId = item.querySelector('.pericia-manual').dataset.pericia;
    const manual = parseInt(item.querySelector('.pericia-manual').value) || 0;
    const total = parseInt(item.querySelector('.pericia-total').textContent) || 0;
    
    ficha.pericias[periciaId] = {
      manual: manual,
      total: total
    };
  });
  
  if (!fichaId) {
    ficha.userId = user.uid;
  }
  
  try {
    if (fichaId) {
      const { userId, ...fichaSemUserId } = ficha;
      await db.collection('fichas').doc(fichaId).update(fichaSemUserId);
      document.getElementById('btn-excluir').style.display = 'block';
    } else {
      const docRef = await db.collection('fichas').add(ficha);
      fichaId = docRef.id;
      document.getElementById('btn-excluir').style.display = 'block';
    }
    alert('Ficha salva com sucesso!');
    carregarFichasDoUsuario();
  } catch (error) {
    console.error('Erro ao salvar ficha:', error);
    alert('Erro ao salvar ficha: ' + error.message);
  }
}

function criarNovaFicha() {
  document.getElementById('nickname').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('idade').value = 18;
  document.getElementById('classe').value = '';
  document.getElementById('posicao').value = 'goleiro';
  document.getElementById('posicao_secundaria').value = 'nenhuma';
  document.getElementById('altura').value = 1.75;
  document.getElementById('peso').value = 70;
  document.getElementById('perna').value = 'direita';
  escolhaAmbidestro = '';
  document.getElementById('dom').value = 'nenhum';
  document.getElementById('folego-atual').value = 10;
  document.getElementById('folego-total').value = 10;
  document.getElementById('gols').value = 0;
  document.getElementById('assistencias').value = 0;
  document.getElementById('sg').value = 0;
  document.getElementById('deslocamento').value = 10;
  document.getElementById('time').value = '';
  document.getElementById('habilidades').value = '';
  document.getElementById('avatar-img').src = '';
  document.getElementById('avatar-img').style.display = 'none';
  document.querySelector('.avatar span').style.display = 'block';
  
  const atributos = ['potencia', 'tecnica', 'velocidade', 'agilidade', 'ego'];
  atributos.forEach(attr => {
    document.getElementById(attr).value = 0;
  });
  
  document.querySelectorAll('.pericia-manual').forEach(input => {
    input.value = 0;
  });
  
  document.querySelectorAll('.pericia-total').forEach(span => {
    span.textContent = '0';
  });
  
  fichaId = '';
  document.getElementById('btn-excluir').style.display = 'none';
  
  // Limpar habilidades
  habilidades = [];
  atualizarListaHabilidades();
  atualizarContadorHabilidades();
  
  atualizarBarraFolego();
  atualizarCamposPosicao();
  calcularPericias();
}

async function carregarFichaSelecionada() {
  const seletor = document.getElementById('fichas-usuario');
  const id = seletor.value;
  if (!id) return;
  
  try {
    const doc = await db.collection('fichas').doc(id).get();
    if (doc.exists) {
      const ficha = doc.data();
      preencherFormulario(ficha);
      fichaId = id;
      document.getElementById('btn-excluir').style.display = 'block';
    }
  } catch (error) {
    console.error('Erro ao carregar ficha:', error);
    alert('Erro ao carregar ficha: ' + error.message);
  }
}

function preencherFormulario(ficha) {
  document.getElementById('nickname').value = ficha.nickname || '';
  document.getElementById('nome').value = ficha.nome || '';
  document.getElementById('idade').value = ficha.idade || 18;
  document.getElementById('classe').value = ficha.classe || '';
  document.getElementById('posicao').value = ficha.posicao || 'goleiro';
  document.getElementById('posicao_secundaria').value = ficha.posicao_secundaria || 'nenhuma';
  document.getElementById('altura').value = ficha.altura || 1.75;
  document.getElementById('peso').value = ficha.peso || 70;
  document.getElementById('perna').value = ficha.perna || 'direita';
  escolhaAmbidestro = ficha.escolhaAmbidestro || '';
  document.getElementById('dom').value = ficha.dom || 'nenhum';
  document.getElementById('folego-atual').value = ficha.folegoAtual || 10;
  document.getElementById('folego-total').value = ficha.folegoTotal || 10;
  document.getElementById('gols').value = ficha.gols || 0;
  document.getElementById('assistencias').value = ficha.assistencias || 0;
  document.getElementById('sg').value = ficha.sg || 0;
  document.getElementById('deslocamento').value = ficha.deslocamento || 10;
  document.getElementById('time').value = ficha.time || '';
  
  // Carregar habilidades
  habilidades = ficha.habilidades || [];
  atualizarListaHabilidades();
  atualizarContadorHabilidades();
  
  if (ficha.avatar) {
    const img = document.getElementById('avatar-img');
    img.src = ficha.avatar;
    img.style.display = 'block';
    document.querySelector('.avatar span').style.display = 'none';
  } else {
    document.getElementById('avatar-img').style.display = 'none';
    document.querySelector('.avatar span').style.display = 'block';
  }
  
  const atributos = ['potencia', 'tecnica', 'velocidade', 'agilidade', 'ego'];
  atributos.forEach(attr => {
    document.getElementById(attr).value = ficha[attr] || 0;
  });
  
  for (const [periciaId, valores] of Object.entries(ficha.pericias || {})) {
    const manualInput = document.querySelector(`.pericia-manual[data-pericia="${periciaId}"]`);
    const totalSpan = document.querySelector(`.pericia-total[data-pericia="${periciaId}"]`);
    
    if (manualInput) manualInput.value = valores.manual;
    if (totalSpan) totalSpan.textContent = valores.total;
  }
  
  atualizarCamposPosicao();
  atualizarBarraFolego();
  calcularPericias();
}

async function carregarFichasDoUsuario() {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    const snapshot = await db.collection('fichas')
      .where('userId', '==', user.uid)
      .get();
      
    const seletor = document.getElementById('fichas-usuario');
    seletor.innerHTML = '';
    
    if (snapshot.empty) {
      document.getElementById('seletor-fichas').style.display = 'none';
      fichasUsuario = [];
      return;
    }
    
    document.getElementById('seletor-fichas').style.display = 'block';
    fichasUsuario = [];
    
    snapshot.forEach(doc => {
      const ficha = doc.data();
      fichasUsuario.push({
        id: doc.id,
        ...ficha
      });
      
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = ficha.nickname || `Ficha ${seletor.options.length + 1}`;
      seletor.appendChild(option);
    });
    
    if (fichaId) {
      seletor.value = fichaId;
      carregarFichaSelecionada();
      return;
    }
    
    if (seletor.options.length > 0) {
      seletor.value = seletor.options[seletor.options.length - 1].value;
      carregarFichaSelecionada();
    }
  } catch (error) {
    console.error('Erro ao carregar fichas:', error);
  }
}

async function carregarFichasParaMestre() {
  try {
    const snapshot = await db.collection('fichas').get();
    const listaFichas = document.getElementById('lista-fichas');
    listaFichas.innerHTML = '';
    
    if (snapshot.empty) {
      listaFichas.innerHTML = '<p>Nenhuma ficha encontrada</p>';
      return;
    }
    
    fichasUsuario = [];
    
    snapshot.forEach(doc => {
      const ficha = doc.data();
      const fichaEl = document.createElement('div');
      fichaEl.className = 'ficha-item';
      fichaEl.setAttribute('data-id', doc.id);
      
      fichasUsuario.push({
        id: doc.id,
        ...ficha
      });
      
      fichaEl.innerHTML = `
        <div class="ficha-avatar">
          ${ficha.avatar ? `<img src="${ficha.avatar}" alt="${ficha.nome}">` : '<i class="fas fa-user fa-2x"></i>'}
        </div>
        <div class="ficha-info">
          <h3>${ficha.nome || 'Sem nome'}</h3>
          <p><strong>Jogador:</strong> ${ficha.nickname || 'Sem apelido'}</p>
          <p><strong>Time:</strong> ${mapaTimes[ficha.time] || '-'} | <strong>Posição:</strong> ${mapaPosicoes[ficha.posicao] || '-'}</p>
          <p><i class="fas fa-futbol"></i> ${ficha.gols || 0} Gols | 
             <i class="fas fa-shoe-prints"></i> ${ficha.assistencias || 0} Assistências</p>
          <p><strong>Proprietário:</strong> ${ficha.userId || 'Não especificado'}</p>
        </div>
        <button class="btn" onclick="editarFicha('${doc.id}')">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-delete" onclick="excluirFichaAdmin('${doc.id}')" style="margin-left: 10px;">
          <i class="fas fa-trash"></i>
        </button>
      `;
      listaFichas.appendChild(fichaEl);
    });
  } catch (error) {
    console.error('Erro ao carregar fichas:', error);
    alert('Erro ao carregar fichas: ' + error.message);
  }
}

function editarFicha(id) {
  mostrarSecao('ficha');
  
  const ficha = fichasUsuario.find(f => f.id === id);
  if (ficha) {
    preencherFormulario(ficha);
    fichaId = id;
    return;
  }
  
  db.collection('fichas').doc(id).get().then(doc => {
    if (doc.exists) {
      preencherFormulario(doc.data());
      fichaId = doc.id;
    }
  });
}

function excluirFicha() {
  if (!fichaId) return;
  
  const fichaNome = document.getElementById('nome').value || 'esta ficha';
  document.getElementById('excluir-mensagem').textContent = `Tem certeza que deseja excluir permanentemente "${fichaNome}"?`;
  document.getElementById('modal-excluir').style.display = 'flex';
}

function excluirFichaAdmin(id) {
  fichaParaExcluir = id;
  document.getElementById('excluir-mensagem').textContent = `Tem certeza que deseja excluir esta ficha permanentemente?`;
  document.getElementById('modal-excluir').style.display = 'flex';
}

async function confirmarExclusao() {
  const id = fichaParaExcluir || fichaId;
  
  if (!id) {
    fecharExclusao();
    return;
  }
  
  try {
    await db.collection('fichas').doc(id).delete();
    
    if (fichaParaExcluir) {
      carregarFichasParaMestre();
      alert('Ficha excluída com sucesso!');
    } else {
      criarNovaFicha();
      carregarFichasDoUsuario();
      alert('Sua ficha foi excluída com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao excluir ficha:', error);
    alert('Erro ao excluir ficha: ' + error.message);
  }
  
  fecharExclusao();
  fichaParaExcluir = null;
}

function fecharExclusao() {
  document.getElementById('modal-excluir').style.display = 'none';
  fichaParaExcluir = null;
}

function fecharModalFicha() {
  document.getElementById('modal-ficha').style.display = 'none';
}

function abrirLogin() {
  document.getElementById('modal-login').style.display = 'flex';
}

function fecharLogin() {
  document.getElementById('modal-login').style.display = 'none';
}

async function fazerLoginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    const userAvatar = document.getElementById('user-avatar');
    if (user.photoURL) {
      userAvatar.innerHTML = `<img src="${user.photoURL}" alt="${user.displayName}">`;
    } else {
      userAvatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    userAvatar.style.display = 'flex';
    
    fecharLogin();
  } catch (error) {
    alert('Erro no login com Google: ' + error.message);
  }
}

function login() {
  abrirLogin();
}

function logout() {
  auth.signOut();
  window.location.reload();
}

// Funções para o sistema de habilidades
function adicionarNovaHabilidade() {
  if (habilidades.length >= 15) {
    alert('Limite máximo de 15 habilidades atingido!');
    return;
  }
  
  document.getElementById('form-nova-habilidade').style.display = 'block';
  document.getElementById('btn-add-habilidade').style.display = 'none';
  limparFormularioHabilidade();
  editandoHabilidadeIndex = -1;
}

function cancelarHabilidade() {
  document.getElementById('form-nova-habilidade').style.display = 'none';
  document.getElementById('btn-add-habilidade').style.display = 'block';
  limparFormularioHabilidade();
  editandoHabilidadeIndex = -1;
}

function limparFormularioHabilidade() {
  document.getElementById('nome-habilidade-input').value = '';
  document.querySelector('input[name="tipo-habilidade"][value="passiva"]').checked = true;
  document.getElementById('custo-habilidade-input').value = '1';
  document.getElementById('custo-container').style.display = 'none';
  document.getElementById('descricao-habilidade-input').value = '';
}

function toggleCustoHabilidade() {
  const tipoAtiva = document.querySelector('input[name="tipo-habilidade"][value="ativa"]').checked;
  document.getElementById('custo-container').style.display = tipoAtiva ? 'block' : 'none';
}

function salvarHabilidade() {
  const nome = document.getElementById('nome-habilidade-input').value.trim();
  const tipo = document.querySelector('input[name="tipo-habilidade"]:checked').value;
  const custo = tipo === 'ativa' ? parseInt(document.getElementById('custo-habilidade-input').value) || 1 : 0;
  const descricao = document.getElementById('descricao-habilidade-input').value.trim();
  
  if (!nome) {
    alert('Por favor, informe o nome da habilidade!');
    return;
  }
  
  if (!descricao) {
    alert('Por favor, informe a descrição da habilidade!');
    return;
  }
  
  const novaHabilidade = {
    nome,
    tipo,
    custo,
    descricao,
    expandida: false
  };
  
  if (editandoHabilidadeIndex >= 0) {
    // Editando habilidade existente
    habilidades[editandoHabilidadeIndex] = novaHabilidade;
  } else {
    // Adicionando nova habilidade
    habilidades.push(novaHabilidade);
  }
  
  atualizarListaHabilidades();
  atualizarContadorHabilidades();
  cancelarHabilidade();
}

function editarHabilidade(index) {
  const habilidade = habilidades[index];
  
  document.getElementById('nome-habilidade-input').value = habilidade.nome;
  document.querySelector(`input[name="tipo-habilidade"][value="${habilidade.tipo}"]`).checked = true;
  document.getElementById('custo-habilidade-input').value = habilidade.custo;
  document.getElementById('custo-container').style.display = habilidade.tipo === 'ativa' ? 'block' : 'none';
  document.getElementById('descricao-habilidade-input').value = habilidade.descricao;
  
  document.getElementById('form-nova-habilidade').style.display = 'block';
  document.getElementById('btn-add-habilidade').style.display = 'none';
  editandoHabilidadeIndex = index;
}

function excluirHabilidade(index) {
  if (confirm('Tem certeza que deseja excluir esta habilidade?')) {
    habilidades.splice(index, 1);
    atualizarListaHabilidades();
    atualizarContadorHabilidades();
  }
}

function toggleExpandirHabilidade(index) {
  habilidades[index].expandida = !habilidades[index].expandida;
  atualizarListaHabilidades();
}

function atualizarListaHabilidades() {
  const listaHabilidades = document.getElementById('lista-habilidades');
  listaHabilidades.innerHTML = '';
  
  if (habilidades.length === 0) {
    listaHabilidades.innerHTML = '<p class="sem-habilidades">Nenhuma habilidade adicionada ainda.</p>';
    return;
  }
  
  habilidades.forEach((habilidade, index) => {
    const habilidadeEl = document.createElement('div');
    habilidadeEl.className = `habilidade-item ${habilidade.tipo}`;
    
    const tipoTexto = habilidade.tipo === 'ativa' ? `(ATIVA - ${habilidade.custo} Fôlego)` : '(PASSIVA)';
    
    habilidadeEl.innerHTML = `
      <div class="habilidade-cabecalho" onclick="toggleExpandirHabilidade(${index})">
        <div class="habilidade-titulo">
          <h4>${habilidade.nome}</h4>
          <span class="habilidade-tipo">${tipoTexto}</span>
        </div>
        <div class="habilidade-controles">
          <button class="btn-icon" onclick="event.stopPropagation(); editarHabilidade(${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon btn-delete" onclick="event.stopPropagation(); excluirHabilidade(${index})">
            <i class="fas fa-trash"></i>
          </button>
          <i class="fas fa-chevron-${habilidade.expandida ? 'up' : 'down'}"></i>
        </div>
      </div>
      <div class="habilidade-descricao" style="display: ${habilidade.expandida ? 'block' : 'none'}">
        <p>${habilidade.descricao}</p>
      </div>
    `;
    
    listaHabilidades.appendChild(habilidadeEl);
  });
}

function atualizarContadorHabilidades() {
  const contador = document.getElementById('habilidades-contador');
  contador.textContent = `${habilidades.length}/15 habilidades`;
  
  // Mostrar/esconder botão de adicionar baseado no limite
  document.getElementById('btn-add-habilidade').style.display = 
    habilidades.length < 15 ? 'block' : 'none';
}

auth.onAuthStateChanged(user => {
  const menuLogin = document.getElementById('menu-login');
  const userAvatar = document.getElementById('user-avatar');
  
  if (user) {
    menuLogin.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
    menuLogin.onclick = logout;
    
    if (user.photoURL) {
      userAvatar.innerHTML = `<img src="${user.photoURL}" alt="${user.displayName}">`;
    } else {
      userAvatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    userAvatar.style.display = 'flex';
    
    carregarFichasDoUsuario();
    verificarEMostrarMenuAdmin();
    
    db.collection('admins').doc(user.uid).get().then(doc => {
      isAdmin = doc.exists;
    });
  } else {
    menuLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
    menuLogin.onclick = login;
    userAvatar.style.display = 'none';
    document.getElementById('seletor-fichas').style.display = 'none';
    document.getElementById('btn-excluir').style.display = 'none';
    
    const menuMestre = document.querySelector('nav a[onclick="mostrarSecao(\'mestre\')"]').parentElement;
    menuMestre.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    document.getElementById('loader').style.display = 'none';
  }, 3000);
  
  verificarImagens();
  
  auth.onAuthStateChanged(user => {
    if (user) {
      carregarFichasDoUsuario();
      verificarEMostrarMenuAdmin();
    }
  });
  
  atualizarBarraFolego();
  atualizarCamposPosicao();
  calcularPericias();
  
  const campos = ['altura', 'peso', 'perna', 'folego-atual', 'folego-total', 'posicao', 'posicao_secundaria'];
  campos.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', calcularPericias);
    }
  });
  
  const atributos = ['potencia', 'tecnica', 'velocidade', 'agilidade', 'ego'];
  atributos.forEach(attr => {
    const element = document.getElementById(attr);
    if (element) {
      element.addEventListener('input', calcularPericias);
    }
  });
  
  document.querySelectorAll('.pericia-manual').forEach(input => {
    input.addEventListener('input', calcularPericias);
  });

  document.getElementById('avatar-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = document.getElementById('avatar-img');
        img.src = event.target.result;
        img.style.display = 'block';
        document.querySelector('.avatar span').style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('folego-atual').addEventListener('input', function() {
    atualizarBarraFolego();
    calcularPericias();
  });

  document.getElementById('folego-total').addEventListener('input', function() {
    atualizarBarraFolego();
    calcularPericias();
  });
  
  // Event listeners para o sistema de habilidades
  document.querySelectorAll('input[name="tipo-habilidade"]').forEach(radio => {
    radio.addEventListener('change', toggleCustoHabilidade);
  });
});
