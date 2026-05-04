// Função para apagar o item (Coloque no final do arquivo)
window.apagarItem = function(id) {
    if(confirm("Deseja apagar esse registro?")) {
        db = db.filter(item => item.id !== id);
        localStorage.setItem('gestao_mestre_v2', JSON.stringify(db));
        render();
    }
};

// Atualize a sua função render() para desenhar o botão
function render() {
    const lista = document.getElementById('lista');
    if (!lista) return;
    lista.innerHTML = '';
    
    let abatimentoBike = 0;
    let saldoLivre = 0;

    db.forEach(item => {
        if(item.cat === 'bike' && item.tipo === 'entrada') abatimentoBike += item.val;
        if(item.tipo === 'entrada') saldoLivre += item.val;
        else saldoLivre -= item.val;

        // Gerando o HTML com a lixeira na direita
        lista.innerHTML += `
            <div class="item ${item.cat === 'bike' ? 'bike' : 'casa'}">
                <div>
                    <small>${item.data} às ${item.hora}</small><br>
                    <strong>${item.desc}</strong>
                </div>
                <div class="item-direita">
                    <div class="valor-txt" style="color: ${item.tipo === 'entrada' ? '#2ecc71' : '#ff7675'}">
                        ${item.tipo === 'saida' ? '-' : '+'} R$ ${item.val.toFixed(2)}
                    </div>
                    <button class="btn-del" onclick="apagarItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    // Atualiza os valores do topo (Dashboard)
    const DIVIDA_INICIAL = 1013.00;
    const dividaRestante = Math.max(0, DIVIDA_INICIAL - abatimentoBike);
    document.getElementById('dividaBike').innerText = `R$ ${dividaRestante.toFixed(2)}`;
    document.getElementById('saldoLivre').innerText = `R$ ${saldoLivre.toFixed(2)}`;
    document.getElementById('valorMetaTxt').innerText = `R$ ${meta.toFixed(2)}`;
    
    let percentual = (saldoLivre / meta) * 100;
    document.getElementById('progressoMeta').style.width = `${Math.min(100, Math.max(0, percentual))}%`;
}