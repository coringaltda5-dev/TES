// script.js
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.auto-save');
  const statusText = document.getElementById('status-salvamento');

  // Ao carregar a página, puxar os dados salvos do navegador
  inputs.forEach(input => {
    const savedValue = localStorage.getItem(input.id);
    if (savedValue !== null) {
      input.value = savedValue;
    }
  });

  // Ao digitar, salvar instantaneamente
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      localStorage.setItem(input.id, input.value);
      
      if(statusText) {
        statusText.style.color = '#1abc9c';
        clearTimeout(window.saveTimeout);
        window.saveTimeout = setTimeout(() => {
          statusText.style.color = '#7f8c8d';
        }, 1000);
      }
    });
  });
});