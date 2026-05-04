document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    // Descobre qual página está aberta para marcar o botão como ativo
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";

    if (menuContainer) {
        menuContainer.innerHTML = `
            <nav id="sidebar">
                <div class="sidebar-header">GESTÃO AI</div>
                <ul class="sidebar-menu">
                    <li>
                        <a href="index.html" class="${page === 'index.html' ? 'active' : ''}">
                            <i class="fas fa-home"></i> Painel Principal
                        </a>
                    </li>
                    <li>
                        <a href="investimentos.html" class="${page === 'investimentos.html' ? 'active' : ''}">
                            <i class="fas fa-coins"></i> Investimentos
                        </a>
                    </li>
                    <li>
                        <a href="config.html" class="${page === 'config.html' ? 'active' : ''}">
                            <i class="fas fa-cog"></i> Configurações
                        </a>
                    </li>
                </ul>
            </nav>
        `;
    }
});