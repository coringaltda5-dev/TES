// script.js
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.auto-save');
  const statusText = document.getElementById('status-salvamento');

  // Inicializa saldo da bike (Valor fixo de custo inicial: 1013)
  if (!localStorage.getItem('saldo-bike')) {
    localStorage.setItem('saldo-bike', "1013.00");
  }

  // Carregar dados e listas ao iniciar
  inputs.forEach(input => {
    const savedValue = localStorage.getItem(input.id);
    if (savedValue !== null) input.value = savedValue;
  });
  
  atualizarInterface();

  // Salva inputs simples
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      localStorage.setItem(input.id, input.value);
      mostrarAvisoSalvo();
    });
  });

  // --- FUNÇÕES DE MOVIMENTAÇÃO ---

  window.lancarMovimentacao = function(idCampoValor, idSaldo, listaKey, tipo) {
    const inputValor = document.getElementById(idCampoValor);
    const valor = parseFloat(inputValor.value.replace(',', '.'));

    if (isNaN(valor) || valor <= 0) return;

    // Atualiza Saldo
    let saldoAtual = parseFloat(localStorage.getItem(idSaldo) || 0);
    // Se for "ganho", ele subtrai do custo (diminui a dívida/gasto total)
    // Se for "investimento", ele soma ao total acumulado
    let novoSaldo = (tipo === 'subtrair') ? saldoAtual - valor : saldoAtual + valor;
    
    localStorage.setItem(idSaldo, novoSaldo.toFixed(2));

    // Adiciona na Lista de Histórico
    const historico = JSON.parse(localStorage.getItem(listaKey) || "[]");
    historico.unshift({
      valor: valor.toFixed(2),
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
    });
    localStorage.setItem(listaKey, JSON.stringify(historico.slice(0, 10))); // Mantém os últimos 10

    inputValor.value = '';
    atualizarInterface();
    mostrarAvisoSalvo();
  };

  function atualizarInterface() {
    // Atualiza campos de saldo na tela
    const camposSaldo = ['saldo-bike', 'acoes-total', 'fiis-total', 'cripto-total'];
    camposSaldo.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = localStorage.getItem(id) || "0.00";
    });

    // Renderiza as listas
    renderizarLista('lista-bike', 'hist-bike');
    renderizarLista('lista-acoes', 'hist-acoes');
    renderizarLista('lista-fiis', 'hist-fiis');
    renderizarLista('lista-cripto', 'hist-cripto');
  }

  function renderizarLista(idElemento, listaKey) {
    const container = document.getElementById(idElemento);
    if (!container) return;
    const dados = JSON.parse(localStorage.getItem(listaKey) || "[]");
    container.innerHTML = dados.map(item => `
      <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:5px 0; border-bottom:1px solid #eee;">
        <span>${item.data} <small>${item.hora}</small></span>
        <span style="font-weight:bold; color: var(--primary);">R$ ${item.valor}</span>
      </div>
    `).join('');
  }

  function mostrarAvisoSalvo() {
    if(statusText) {
      statusText.classList.add('saved');
      setTimeout(() => statusText.classList.remove('saved'), 1500);
    }
  }
});