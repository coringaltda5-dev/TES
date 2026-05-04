// script.js
document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('status-salvamento');
    const DIVIDA_INICIAL_BIKE = 1013.00;

    // Inicializa Banco de Dados e Meta
    let db = JSON.parse(localStorage.getItem('gestao_mestre_v2')) || [];
    let meta = parseFloat(localStorage.getItem('meta_valor')) || 2000.00;

    // Funções de Interface
    window.editarMeta = function() {
        let novaMeta = prompt("Digite o novo valor da sua meta:", meta);
        if (novaMeta !== null && !isNaN(novaMeta) && novaMeta > 0) {
            meta = parseFloat(novaMeta);
            localStorage.setItem('meta_valor', meta);
            render();
        }
    };

    window.salvar = function() {
        const cat = document.getElementById('categoria').value;
        const tipo = document.getElementById('tipo').value;
        const desc = document.getElementById('desc').value;
        const valInput = document.getElementById('valor');
        const val = parseFloat(valInput.value);

        if (!desc || isNaN(val)) return alert("Preencha a descrição e o valor!");

        const novo = {
            id: Date.now(),
            cat,
            tipo,
            desc,
            val,
            data: new Date().toLocaleDateString('pt-BR'),
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        db.push(novo);
        localStorage.setItem('gestao_mestre_v2', JSON.stringify(db));
        
        // Limpa campos
        document.getElementById('desc').value = '';
        valInput.value = '';
        
        render();
        mostrarAvisoSalvo();
    };

    function render() {
        const lista = document.getElementById('lista');
        if (!lista) return;

        lista.innerHTML = '';
        let abatimentoBike = 0;
        let saldoLivre = 0;

        // Processa os dados (do mais novo para o mais antigo)
        db.slice().reverse().forEach(item => {
            // Lógica de abatimento da Bike (Entradas na categoria bike diminuem a dívida)
            if (item.cat === 'bike' && item.tipo === 'entrada') {
                abatimentoBike += item.val;
            }

            // Cálculo do Saldo Geral Livre
            if (item.tipo === 'entrada') {
                saldoLivre += item.val;
            } else {
                saldoLivre -= item.val;
            }

            // Cria o item visual na lista
            lista.innerHTML += `
                <div class="item ${item.cat === 'bike' ? 'bike' : 'casa'}">
                    <div>
                        <small>${item.data} às ${item.hora || ''}</small><br>
                        <strong>${item.desc}</strong>
                    </div>
                    <div class="valor-txt" style="color: ${item.tipo === 'entrada' ? '#27ae60' : '#e74c3c'}">
                        ${item.tipo === 'saida' ? '-' : '+'} R$ ${item.val.toFixed(2)}
                    </div>
                </div>
            `;
        });

        // --- ATUALIZAÇÃO DO DASHBOARD ---
        
        // 1. Dívida Bike
        const dividaBikeTotal = document.getElementById('dividaBike');
        if (dividaBikeTotal) {
            const dividaAtual = DIVIDA_INICIAL_BIKE - abatimentoBike;
            dividaBikeTotal.innerText = `R$ ${Math.max(0, dividaAtual).toFixed(2)}`;
        }

        // 2. Saldo Geral
        const saldoLivreTotal = document.getElementById('saldoLivre');
        if (saldoLivreTotal) {
            saldoLivreTotal.innerText = `R$ ${saldoLivre.toFixed(2)}`;
            saldoLivreTotal.style.color = saldoLivre >= 0 ? '#2ecc71' : '#ff7675';
        }

        // 3. Meta e Barra de Progresso
        const valorMetaTxt = document.getElementById('valorMetaTxt');
        const progressoMeta = document.getElementById('progressoMeta');
        
        if (valorMetaTxt) valorMetaTxt.innerText = `R$ ${meta.toFixed(2)}`;
        
        if (progressoMeta) {
            let percentual = (saldoLivre / meta) * 100;
            // Garante que o progresso fique entre 0% e 100%
            let width = Math.min(100, Math.max(0, percentual));
            progressoMeta.style.width = `${width}%`;
        }
    }

    function mostrarAvisoSalvo() {
        const aviso = document.getElementById('status-salvamento');
        if (aviso) {
            aviso.innerText = "Salvo!";
            aviso.style.color = "#27ae60";
            setTimeout(() => {
                aviso.innerText = "Sincronizado";
                aviso.style.color = "#bdc3c7";
            }, 1500);
        }
    }

    // Executa a renderização inicial
    render();
});