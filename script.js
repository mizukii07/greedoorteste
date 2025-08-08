// Função para trocar seções no menu lateral
function mostrarSecao(secao) {
  const secoes = ['ficha', 'ranking', 'leilao'];
  secoes.forEach(s => {
    document.getElementById('secao-' + s).style.display = (s === secao) ? 'block' : 'none';
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('ativo');
    });
  });

  const ativo = document.querySelector(`.menu-item[onclick="mostrarSecao('${secao}')"]`);
  if (ativo) ativo.classList.add('ativo');
}

// Função fictícia para logout
function logout() {
  alert('Logout efetuado (simulação).');
}

// Atualiza barra de fôlego
function atualizarBarraFolego() {
  const atual = Number(document.getElementById('folego-atual').value);
  const total = Number(document.getElementById('folego-total').value);
  let porcentagem = 0;
  if(total > 0) {
    porcentagem = (atual / total) * 100;
    if(porcentagem > 100) porcentagem = 100;
    if(porcentagem < 0) porcentagem = 0;
  }
  document.getElementById('barra-folego').style.width = porcentagem + '%';
}

// Atualiza pericias totais com base em atributos + manual
function atualizarPericias() {
  const atributos = ['potencia', 'tecnica', 'velocidade', 'agilidade', 'ego'];
  atributos.forEach(attr => {
    const atributoVal = Number(document.getElementById(attr).value);
    document.querySelectorAll(`.pericia-manual[data-pericia]`).forEach(input => {
      const pericia = input.getAttribute('data-pericia');
      let base = 0;
      if (attr === 'potencia' && ['corpo','cabeceio','chute'].includes(pericia)) {
        base = atributoVal;
      } else if (attr === 'tecnica' && ['passe','drible','dominio','pontaria','roubo'].includes(pericia)) {
        base = atributoVal;
      } else if (attr === 'velocidade' && ['corrida','explosao'].includes(pericia)) {
        base = atributoVal;
      } else if (attr === 'agilidade' && ['reflexos','defesa','furtividade','acrobacia'].includes(pericia)) {
        base = atributoVal;
      } else if (attr === 'ego' && ['intimidacao','concentracao','resistencia'].includes(pericia)) {
        base = atributoVal;
      }
      const manualVal = Number(input.value);
      const total = base + manualVal;
      document.querySelector(`.pericia-total[data-pericia="${pericia}"]`).innerText = total;
    });
  });
}

// Salva ficha no localStorage
function salvarFicha() {
  const ficha = {
    nome: document.getElementById('nome').value,
    idade: document.getElementById('idade').value,
    classe: document.getElementById('classe').value,
    posicao: document.getElementById('posicao').value,
    altura: document.getElementById('altura').value,
    peso: document.getElementById('peso').value,
    perna: document.getElementById('perna').value,
    dom: document.getElementById('dom').value,
    folegoAtual: document.getElementById('folego-atual').value,
    folegoTotal: document.getElementById('folego-total').value,
    potencia: document.getElementById('potencia').value,
    tecnica: document.getElementById('tecnica').value,
    velocidade: document.getElementById('velocidade').value,
    agilidade: document.getElementById('agilidade').value,
    ego: document.getElementById('ego').value,
    periciasManuais: {}
  };

  document.querySelectorAll('.pericia-manual').forEach(input => {
    ficha.periciasManuais[input.getAttribute('data-pericia')] = input.value;
  });

  localStorage.setItem('fichaGreenDoor', JSON.stringify(ficha));
  alert('Ficha salva localmente no navegador.');
}

// Carrega ficha do localStorage
function carregarFicha() {
  const fichaStr = localStorage.getItem('fichaGreenDoor');
  if (!fichaStr) return;
  const ficha = JSON.parse(fichaStr);

  document.getElementById('nome').value = ficha.nome || '';
  document.getElementById('idade').value = ficha.idade || 18;
  document.getElementById('classe').value = ficha.classe || '';
  document.getElementById('posicao').value = ficha.posicao || 'goleiro';
  document.getElementById('altura').value = ficha.altura || 1.75;
  document.getElementById('peso').value = ficha.peso || 70;
  document.getElementById('perna').value = ficha.perna || 'direita';
  document.getElementById('dom').value = ficha.dom || 'nenhum';
  document.getElementById('folego-atual').value = ficha.folegoAtual || 10;
  document.getElementById('folego-total').value = ficha.folegoTotal || 10;
  document.getElementById('potencia').value = ficha.potencia || 0;
  document.getElementById('tecnica').value = ficha.tecnica || 0;
  document.getElementById('velocidade').value = ficha.velocidade || 0;
  document.getElementById('agilidade').value = ficha.agilidade || 0;
  document.getElementById('ego').value = ficha.ego || 0;

  Object.entries(ficha.periciasManuais || {}).forEach(([pericia, val]) => {
    const el = document.querySelector(`.pericia-manual[data-pericia="${pericia}"]`);
    if (el) el.value = val;
  });

  atualizarPericias();
  atualizarBarraFolego();
}

// Atualiza quando mudar algum atributo ou pericia manual
document.querySelectorAll('.atributo-input').forEach(input => {
  input.addEventListener('input', atualizarPericias);
});
document.querySelectorAll('.pericia-manual').forEach(input => {
  input.addEventListener('input', atualizarPericias);
});
document.getElementById('folego-atual').addEventListener('input', atualizarBarraFolego);
document.getElementById('folego-total').addEventListener('input', atualizarBarraFolego);

// Carrega ficha ao abrir a página
window.onload = () => {
  carregarFicha();
  mostrarSecao('ficha');
};

// Avatar - mostrar imagem selecionada
document.getElementById('avatar-input').addEventListener('change', function(e) {
  const arquivo = e.target.files[0];
  if (!arquivo) return;

  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = document.getElementById('avatar-img');
    img.src = ev.target.result;
    img.style.display = 'block';

    // Remove texto "Sem imagem"
    const texto = img.parentElement.querySelector('span');
    if (texto) texto.style.display = 'none';
  };
  reader.readAsDataURL(arquivo);
});
