document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.auto-save');
  const statusText = document.getElementById('status-salvamento');

  // Inicializa o custo fixo da bicicleta se for o primeiro acesso
  if (!localStorage.getItem('saldo-bike')) {
    localStorage.setItem('saldo-bike', "1013.00");
  }

  // Carrega valores simples e atualiza a tela
  inputs.forEach(input => {
    const savedValue = localStorage.getItem(input.id);
    if (savedValue !== null) input.value = savedValue;
  });
  
  atualizarInterface();

  // Salva campos de texto automaticamente
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      localStorage.setItem(input.id, input.value);
      mostrarAvisoSalvo();
    });
  });

  // FUNÇÃO PARA LANÇAR GANHOS OU INVESTIMENTOS
  window.lancarMovimentacao = function(idCampoValor, idSaldo, listaKey, tipo) {
    const inputValor = document.getElementById(idCampoValor);
    const valor = parseFloat(inputValor.value.replace(',', '.'));

    if (isNaN(valor) || valor <= 0) return;

    let saldoAtual = parseFloat(localStorage.getItem(idSaldo) || 0);
    
    // Se tipo for 'subtrair' (Bike), o ganho diminui o custo.
    // Se for 'somar' (Investimentos), o valor aumenta o total.
    let novoSaldo = (tipo === 'subtrair') ? saldoAtual - valor : saldoAtual + valor;
    
    localStorage.setItem(idSaldo, novoSaldo.toFixed(2));

    // Salva no Histórico (Lista)
    const historico = JSON.parse(localStorage.getItem(listaKey) || "[]");
    historico.unshift({
      valor: valor.toFixed(2),
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
    });
    localStorage.setItem(listaKey, JSON.stringify(historico.slice(0, 5))); // Salva os últimos 5

    inputValor.value = '';
    atualizarInterface();
    mostrarAvisoSalvo();
  };

  function atualizarInterface() {
    const ids = ['saldo-bike', 'acoes-total', 'fiis-total', 'cripto-total'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = localStorage.getItem(id) || "0.00";
    });

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
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; padding:8px 0; border-bottom:1px solid #eee; color:#475569;">
        <span>${item.data} <small>${item.hora}</small></span>
        <span style="font-weight:600; color: #6366f1;">R$ ${item.valor}</span>
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