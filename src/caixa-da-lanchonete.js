class CaixaDaLanchonete {

    // array de objetos representando o cardápio
    static cardapio = [
        { codigo: "cafe", extra: null, preco: 3 },
        { codigo: "chantily", extra: "cafe", preco: 1.5 },
        { codigo: "suco", extra: null, preco: 6.2 },
        { codigo: "sanduiche", extra: null, preco: 6.5 },
        { codigo: "queijo", extra: "sanduiche", preco: 2 },
        { codigo: "salgado", extra: null, preco: 7.25 },
        { codigo: "combo1", extra: null, preco: 9.50 },
        { codigo: "combo2", extra: null, preco: 7.50 }
    ];

    // validaMetodoPagamento: String (metodoDePagamento) -> Boolean (método válido?)
    validaMetodoPagamento(metodoDePagamento) {
        return ((metodoDePagamento === "dinheiro") ||
            (metodoDePagamento === "debito") ||
            (metodoDePagamento === "credito"))
    }

    // itemEhExtra: String (código) -> Boolean (item é extra?)
    itemEhExtra(codigo) {
        if (codigo === "queijo" || codigo === "chantily") return true;

        return false;
    }

    // itemEhCombo String (código) -> Boolean (item é combo?)
    itemEhCombo(codigo) {
        return codigo.slice(0, -1) === "combo";
    }

    // validaExistenciaCodigos: ArrayDeStrings (itens) -> Boolean (código existe?)
    validaExistenciaCodigos(itens) {
        for (let i = 0; i < itens.length; i++) {
            const [codigo, quantidade] = itens[i].split(",");
            const itemEncontrado = CaixaDaLanchonete.cardapio.find(item => item.codigo === codigo);

            if (itemEncontrado === undefined) return false;
        }

        return true;
    }

    // validaCarrinhoVazio: ArrayDeStrings (itens) -> Boolean (carrinho está vazio?)
    validaCarrinhoVazio(itens) {
        return (itens.length === 0);
    }

    // validaParidadeExtraPrincipal: ArrayDeStrings (itens) -> Boolean (existe pelo menos um extra sem o respectivo principal?)
    validaParidadeExtraPrincipal(itens) {
        let achouExtra = false;
        let achouPrincipal = false;

        for (let i = 0; i < itens.length; i++) {
            const codExterno = itens[i].split(",")[0];

            if (!this.itemEhExtra(codExterno)) {

                continue;
            } else {

                achouExtra = true;
            }

            for (let j = 0; j < itens.length; j++) {
                
                const codInterno = itens[j].split(",")[0];
                // ignora os combos; ignora iterações sobre o mesmo item; ignora extras
                if (i === j || this.itemEhCombo(codInterno) || this.itemEhExtra(codInterno)) continue;

                const prodPrincipal = CaixaDaLanchonete.cardapio.find(item => item.codigo === codExterno && item.extra === codInterno);

                if (prodPrincipal !== undefined) {

                    achouPrincipal = true;
                }
            }

            if (achouExtra && !achouPrincipal) return false;

            achouExtra = false;
            achouPrincipal = false;
        }

        return true;
    }

    // verificaQuantidadeNula: ArrayDeStrings (itens) -> Boolean (existe pelo menos um item com quantidade igual/menor que zero?)
    verificaQuantidadeNula(itens) {
        for (let i = 0; i < itens.length; i++) {
            const [codigo, quantidade] = itens[i].split(",");
            if (Number(quantidade) <= 0) return true;
        }

        return false;
    }

    // aplicaDesconto: Number (valorTotal) String (metodoDePagamento) -> Number (ValorDepoisDoDesconto)
    aplicaDesconto(valorTotal, metodoDePagamento) {
        if (metodoDePagamento === "dinheiro") {
            valorTotal *= 0.95;
        } else if (metodoDePagamento === "credito") {
            valorTotal *= 1.03;
        }

        return valorTotal;
    }

    // retornaPreçoPeloCodigo: String (código) -> NumberOuUndefined (Preço no caso de sucesso ou undefined se houver erro)
    retornaPrecoPeloCodigo(codigo) {
        return CaixaDaLanchonete.cardapio.find(item => item.codigo === codigo)?.preco;
    }

    // calcularValorDaCompra: String (metodoDePagamento) ArrayDeStrings (itens) -> String (MensagemDeErroOuValorTotalDaCompra)
    calcularValorDaCompra(metodoDePagamento, itens) {

        // validações
        if(!this.validaMetodoPagamento(metodoDePagamento)) return "Forma de pagamento inválida!";
        if(this.validaCarrinhoVazio(itens)) return "Não há itens no carrinho de compra!"
        if(this.verificaQuantidadeNula(itens)) return "Quantidade inválida!";
        if(!this.validaExistenciaCodigos(itens)) return "Item inválido!";
        if(!this.validaParidadeExtraPrincipal(itens)) return "Item extra não pode ser pedido sem o principal";

        let totalPagamento = 0;
        itens.forEach(item => {
            const [codigo, quantidade] = item.split(",");
            totalPagamento += this.retornaPrecoPeloCodigo(codigo) * Number(quantidade);
        });

        if (metodoDePagamento === "dinheiro" || metodoDePagamento === "credito") {
            totalPagamento = this.aplicaDesconto(totalPagamento, metodoDePagamento);
        }

        return `R$ ${totalPagamento.toFixed(2).replace(".", ",")}`;
    }
}

export { CaixaDaLanchonete };
