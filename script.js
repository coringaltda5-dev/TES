document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.auto-save');
  const statusText = document.getElementById('status-salvamento');

  // Inicializa o valor fixo da bicicleta caso seja o primeiro acesso
  const saldoBike = document.getElementById('saldo-bike');
  if (saldoBike && !localStorage.getItem('saldo-bike')) {
    saldoBike.value = "1013.00";
    localStorage.setItem('saldo-bike', "1013.00");
  }

  // Função para piscar o botão de "Salvo"
  function mostrarAvisoSalvo() {
    if(statusText) {
      statusText.textContent = "Salvo no navegador!";
      statusText.classList.add('saved');
      
      clearTimeout(window.saveTimeout);
      window.saveTimeout = setTimeout(() => {
        statusText.classList.remove('saved');
        statusText.textContent = "Sincronizado";
      }, 1500);
    }
  }

  // Puxa os dados salvos no navegador ao abrir
  inputs.forEach(input => {
    const savedValue = localStorage.getItem(input.id);
    if (savedValue !== null) {
      input.value = savedValue;
    }
  });

  // Salva no navegador a cada tecla digitada
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      localStorage.setItem(input.id, input.value);
      mostrarAvisoSalvo();
    });
  });

  // Lógica de subtração do gasto da Bicicleta
  window.adicionarGastoBike = function() {
    const gastoInput = document.getElementById('gasto-bike');
    if (gastoInput.value && saldoBike) {
      let saldoAtual = parseFloat(saldoBike.value);
      let novoGasto = parseFloat(gastoInput.value.replace(',', '.'));
      
      let novoSaldo = saldoAtual - novoGasto;
      saldoBike.value = novoSaldo.toFixed(2);
      
      // Salva o novo saldo no navegador
      localStorage.setItem('saldo-bike', saldoBike.value);
      gastoInput.value = ''; // Limpa o campo de digitação
      mostrarAvisoSalvo();
    }
  };
});