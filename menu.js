document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    
    if (menuContainer) {
        menuContainer.innerHTML = `
            <nav id="sidebar">
                <div class="sidebar-header">
                    <i class="fas fa-wallet"></i> Gestão AI
                </div>
                <ul class="sidebar-menu">
                    <li>
                        <a href="index.html">
                            <i class="fas fa-home"></i>
                            <span class="link-text">Painel Principal</span>
                        </a>
                    </li>
                    <li>
                        <a href="investimentos.html">
                            <i class="fas fa-chart-line"></i>
                            <span class="link-text">Investimentos</span>
                        </a>
                    </li>
                    <li>
                        <a href="configuracoes.html">
                            <i class="fas fa-cog"></i>
                            <span class="link-text">Configurações</span>
                        </a>
                    </li>
                </ul>
            </nav>
        `;
    }
});