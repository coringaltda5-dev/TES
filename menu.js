document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
    
    if (menuContainer) {
        menuContainer.innerHTML = `
            <nav id="sidebar">
                <div class="sidebar-header">
                    <i class="fas fa-chart-pie"></i> GESTÃO 
                </div>
                <ul class="sidebar-menu">
                    <li>
                        <a href="index.html" class="${paginaAtual === 'index.html' ? 'active' : ''}">
                            <i class="fas fa-th-large"></i>
                            <span class="link-text">Painel Principal</span>
                        </a>
                    </li>
                    <li>
                        <a href="investimentos.html" class="${paginaAtual === 'investimentos.html' ? 'active' : ''}">
                            <i class="fas fa-coins"></i>
                            <span class="link-text">Investimentos</span>
                        </a>
                    </li>
                    <li>
                        <a href="configuracoes.html" class="${paginaAtual === 'configuracoes.html' ? 'active' : ''}">
                            <i class="fas fa-user-gear"></i>
                            <span class="link-text">Configurações</span>
                        </a>
                    </li>
                </ul>
            </nav>
        `;
    }
});