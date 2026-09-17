/* =====================================
   SISTEMA DA GARAGE PRIME
===================================== */


/* =====================================
   PEGAR ELEMENTOS
===================================== */

const formulario =
    document.getElementById("formVeiculo");

const tabela =
    document.getElementById("tabelaVeiculos");

const mensagemVazia =
    document.getElementById("mensagemVazia");

const busca =
    document.getElementById("busca");


/* =====================================
   CARREGAR DADOS
===================================== */

let veiculos =
    JSON.parse(
        localStorage.getItem("garagePrimeVeiculos")
    ) || [];


/* =====================================
   FORMATAR DINHEIRO
===================================== */

function dinheiro(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =====================================
   FORMATAR DATA
===================================== */

function formatarData(data) {

    if (!data) {
        return "-";
    }

    const partes =
        data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* =====================================
   SALVAR
===================================== */

function salvarDados() {

    localStorage.setItem(
        "garagePrimeVeiculos",
        JSON.stringify(veiculos)
    );

}


/* =====================================
   CADASTRAR
===================================== */

formulario.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const tipo =
            document.querySelector(
                'input[name="tipo"]:checked'
            ).value;


        const dataEntrada =
            document.getElementById(
                "dataEntrada"
            ).value;


        const dataSaida =
            document.getElementById(
                "dataSaida"
            ).value;


        const cliente =
            document.getElementById(
                "cliente"
            ).value;


        const veiculo =
            document.getElementById(
                "veiculo"
            ).value;


        const compradoDe =
            document.getElementById(
                "compradoDe"
            ).value;


        const ano =
            document.getElementById(
                "ano"
            ).value;


        const pagamento =
            document.getElementById(
                "pagamento"
            ).value;


        const valorCompra =
            Number(
                document.getElementById(
                    "valorEntrada"
                ).value
            );


        const valorVenda =
            Number(
                document.getElementById(
                    "valorSaida"
                ).value
            );


        const lucro =
            valorVenda - valorCompra;


        const novoVeiculo = {

            id: Date.now(),

            tipo: tipo,

            dataEntrada: dataEntrada,

            dataSaida: dataSaida,

            cliente: cliente,

            veiculo: veiculo,

            compradoDe: compradoDe,

            ano: ano,

            pagamento: pagamento,

            valorCompra: valorCompra,

            valorVenda: valorVenda,

            lucro: lucro

        };


        veiculos.push(novoVeiculo);


        salvarDados();


        formulario.reset();


        document.querySelector(
            'input[name="tipo"][value="Carro"]'
        ).checked = true;


        atualizarTela();


        alert(
            "Veículo cadastrado com sucesso! 🚗"
        );

    }
);


/* =====================================
   MOSTRAR VEÍCULOS
===================================== */

function mostrarVeiculos(lista = veiculos) {

    tabela.innerHTML = "";


    if (lista.length === 0) {

        mensagemVazia.style.display =
            "block";

        return;

    }


    mensagemVazia.style.display =
        "none";


    lista.forEach(function(item) {

        const linha =
            document.createElement("tr");


        const classeTipo =
            item.tipo === "Moto"
                ? "moto"
                : "";


        const classeLucro =
            item.lucro >= 0
                ? "lucro"
                : "prejuizo";


        const status =
            item.dataSaida
                ? "Vendido"
                : "Em estoque";


        const classeStatus =
            item.dataSaida
                ? ""
                : "status-estoque";


        linha.innerHTML = `

            <td>

                <span class="tipo-badge ${classeTipo}">

                    ${
                        item.tipo === "Moto"
                            ? "🏍️ Moto"
                            : "🚗 Carro"
                    }

                </span>

            </td>


            <td>

                <span class="veiculo-nome">

                    ${item.veiculo}

                </span>

            </td>


            <td>

                ${item.ano}

            </td>


            <td>

                ${item.cliente}

            </td>


            <td>

                ${dinheiro(item.valorCompra)}

            </td>


            <td>

                ${dinheiro(item.valorVenda)}

            </td>


            <td>

                <span class="${classeLucro}">

                    ${dinheiro(item.lucro)}

                </span>

            </td>


            <td>

                <span class="status-badge ${classeStatus}">

                    ${status}

                </span>

            </td>


            <td>

                <button
                    class="btn-excluir"
                    onclick="excluirVeiculo(${item.id})"
                    title="Excluir">

                    🗑️

                </button>

            </td>

        `;


        tabela.appendChild(linha);

    });

}


/* =====================================
   EXCLUIR
===================================== */

function excluirVeiculo(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este veículo?"
        );


    if (!confirmar) {
        return;
    }


    veiculos =
        veiculos.filter(
            function(item) {

                return item.id !== id;

            }
        );


    salvarDados();

    atualizarTela();

}


/* =====================================
   ATUALIZAR RESUMO
===================================== */

function atualizarResumo() {

    const total =
        veiculos.length;


    const vendas =
        veiculos.reduce(
            function(total, item) {

                return total + item.valorVenda;

            },
            0
        );


    const lucro =
        veiculos.reduce(
            function(total, item) {

                return total + item.lucro;

            },
            0
        );


    document.getElementById(
        "totalVeiculos"
    ).textContent = total;


    document.getElementById(
        "totalVendas"
    ).textContent = dinheiro(vendas);


    document.getElementById(
        "lucroTotal"
    ).textContent = dinheiro(lucro);

}


/* =====================================
   BUSCAR
===================================== */

busca.addEventListener(
    "input",
    function() {

        const texto =
            busca.value
                .toLowerCase()
                .trim();


        const filtrados =
            veiculos.filter(
                function(item) {

                    return (

                        item.veiculo
                            .toLowerCase()
                            .includes(texto)

                        ||

                        item.cliente
                            .toLowerCase()
                            .includes(texto)

                        ||

                        item.tipo
                            .toLowerCase()
                            .includes(texto)

                        ||

                        String(item.ano)
                            .includes(texto)

                    );

                }
            );


        mostrarVeiculos(filtrados);

    }
);


/* =====================================
   ATUALIZAR TUDO
===================================== */

function atualizarTela() {

    mostrarVeiculos();

    atualizarResumo();

}


/* =====================================
   DATA DE HOJE
===================================== */

const hoje =
    new Date()
        .toISOString()
        .split("T")[0];


document.getElementById(
    "dataEntrada"
).value = hoje;


/* =====================================
   INICIAR SISTEMA
===================================== */

atualizarTela();