// menu.js
document.addEventListener('DOMContentLoaded', () => {
  const menuContainer = document.getElementById('menu-container');
  
  if (menuContainer) {
    menuContainer.innerHTML = `
      <div class="sidebar">
        <h2>Gestão Dashboard</h2>
        <a href="index.html" id="link-principal">Painel Principal</a>
        <a href="investimentos.html" id="link-investimentos">Investimentos</a>
      </div>
    `;

    // Lógica para deixar o botão "ativo" dependendo da página que você está
    const currentPage = window.location.pathname;
    if (currentPage.includes('investimentos.html')) {
      document.getElementById('link-investimentos').classList.add('active');
    } else {
      document.getElementById('link-principal').classList.add('active');
    }
  }
});