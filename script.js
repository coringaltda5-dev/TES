document.addEventListener('DOMContentLoaded', () => {
    // Configurações Iniciais
    const DIVIDA_INICIAL_BIKE = 1013.00; // Valor fixo conforme solicitado
    
    // Tenta carregar os dados salvos; se não houver, começa com uma lista vazia
    let db = JSON.parse(localStorage.getItem('gestao_mestre_v2')) || [];
    let meta = parseFloat(localStorage.getItem('meta_valor')) || 2000.00;

    // Função para salvar a meta e atualizar a tela
    window.editarMeta = function() {
        let novaMeta = prompt("Digite o novo valor da sua meta:", meta);
        if (novaMeta !== null && !isNaN(novaMeta)) {
            meta = parseFloat(novaMeta);
            localStorage.setItem('meta_valor', meta); // Salva automaticamente
            render();
        }
    };

    // Função para remover um item e salvar a mudança automaticamente
    window.apagarItem = function(id) {
        if(confirm("Deseja realmente apagar este lançamento?")) {
            db = db.filter(item => item.id !== id);
            salvarNoStorage(); // Atualiza o banco de dados local
            render();
        }
    };

    // Função para capturar os dados do formulário e salvar
    window.salvar = function() {
        const cat = document.getElementById('categoria').value;
        const tipo = document.getElementById('tipo').value;
        const desc = document.getElementById('desc').value;
        const val = parseFloat(document.getElementById('valor').value);
        const dataInput = document.getElementById('dataLancamento').value;

        if(!desc || isNaN(val)) return alert("Preencha Descrição e Valor!");

        // Se não colocar data, ele usa a hora atual
        let dataObjeto = dataInput ? new Date(dataInput) : new Date();

        const novo = {
            id: Date.now(), // ID único para exclusão
            cat,
            tipo,
            desc,
            val,
            data: dataObjeto.toLocaleDateString('pt-BR'),
            hora: dataObjeto.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            timestamp: dataObjeto.getTime()
        };

        db.push(novo);
        db.sort((a, b) => b.timestamp - a.timestamp); // Mantém os mais novos no topo
        
        salvarNoStorage(); // Salva automaticamente após adicionar
        
        // Limpa os campos para o próximo lançamento
        document.getElementById('desc').value = '';
        document.getElementById('valor').value = '';
        
        render();
    };

    // Função Central de Salvamento Automático
    function salvarNoStorage() {
        localStorage.setItem('gestao_mestre_v2', JSON.stringify(db));
    }

    // Função para desenhar a lista e calcular os totais
    function render() {
        const lista = document.getElementById('lista');
        if (!lista) return;
        lista.innerHTML = '';
        
        let abatimentoBike = 0;
        let saldoLivre = 0;

        db.forEach(item => {
            // Se for entrada na categoria bike, diminui a dívida
            if(item.cat === 'bike' && item.tipo === 'entrada') {
                abatimentoBike += item.val;
            }

            // Cálculo do saldo geral (Entrada soma, Saída subtrai)
            if(item.tipo === 'entrada') saldoLivre += item.val;
            else saldoLivre -= item.val;

            // Cria o HTML de cada item com o botão de lixeira na direita
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

        // Atualiza os valores do Dashboard no topo
        const dividaRestante = Math.max(0, DIVIDA_INICIAL_BIKE - abatimentoBike);
        document.getElementById('dividaBike').innerText = `R$ ${dividaRestante.toFixed(2)}`;
        document.getElementById('saldoLivre').innerText = `R$ ${saldoLivre.toFixed(2)}`;
        
        // Atualiza a meta e a barra de progresso
        document.getElementById('valorMetaTxt').innerText = `R$ ${meta.toFixed(2)}`;
        let percentual = (saldoLivre / meta) * 100;
        document.getElementById('progressoMeta').style.width = `${Math.min(100, Math.max(0, percentual))}%`;
    }

    // Inicia a página já mostrando os dados salvos
    render();
});