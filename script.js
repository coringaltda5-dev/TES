document.addEventListener('DOMContentLoaded', () => {
    const DIVIDA_INICIAL_BIKE = 1013.00; 
    let db = JSON.parse(localStorage.getItem('gestao_mestre_v2')) || [];
    let meta = parseFloat(localStorage.getItem('meta_valor')) || 2000.00;

    window.editarMeta = function() {
        let novaMeta = prompt("Digite o novo valor da meta:", meta);
        if (novaMeta !== null && !isNaN(novaMeta)) {
            meta = parseFloat(novaMeta);
            localStorage.setItem('meta_valor', meta);
            render();
        }
    };

    // FUNÇÃO PARA REMOVER O ITEM
    window.apagarItem = function(id) {
        if(confirm("Deseja realmente apagar este registro?")) {
            db = db.filter(item => item.id !== id);
            localStorage.setItem('gestao_mestre_v2', JSON.stringify(db));
            render();
        }
    };

    window.salvar = function() {
        const cat = document.getElementById('categoria').value;
        const tipo = document.getElementById('tipo').value;
        const desc = document.getElementById('desc').value;
        const val = parseFloat(document.getElementById('valor').value);
        const dataManual = document.getElementById('dataLancamento').value;

        if(!desc || isNaN(val)) return alert("Preencha Descrição e Valor!");

        const dataObj = dataManual ? new Date(dataManual) : new Date();

        const novo = {
            id: Date.now(), // ID único para poder apagar depois
            cat,
            tipo,
            desc,
            val,
            data: dataObj.toLocaleDateString('pt-BR'),
            hora: dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            timestamp: dataObj.getTime()
        };

        db.push(novo);
        db.sort((a, b) => b.timestamp - a.timestamp); // Mais recentes primeiro
        localStorage.setItem('gestao_mestre_v2', JSON.stringify(db));
        
        document.getElementById('desc').value = '';
        document.getElementById('valor').value = '';
        render();
    };

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

            lista.innerHTML += `
                <div class="item ${item.cat === 'bike' ? 'bike' : 'casa'}">
                    <div class="item-info">
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

        const dividaRestante = Math.max(0, DIVIDA_INICIAL_BIKE - abatimentoBike);
        document.getElementById('dividaBike').innerText = `R$ ${dividaRestante.toFixed(2)}`;
        document.getElementById('saldoLivre').innerText = `R$ ${saldoLivre.toFixed(2)}`;
        document.getElementById('valorMetaTxt').innerText = `R$ ${meta.toFixed(2)}`;
        
        let percentual = (saldoLivre / meta) * 100;
        document.getElementById('progressoMeta').style.width = `${Math.min(100, Math.max(0, percentual))}%`;
    }

    render();
});