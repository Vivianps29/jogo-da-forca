const readline = require('readline');

// Configuração da interface de leitura do terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// 1. Banco de dados com 20 palavras divididas em 3 categorias
const BANCO_DE_PALAVRAS = {
    Tecnologia: ['JAVASCRIPT', 'COMPUTADOR', 'INTERNET', 'ALGORITMO', 'PROGRAMACAO', 'SOFTWARE', 'HARDWARE'],
    Animais: ['CACHORRO', 'ELEFANTE', 'GIRAFA', 'CHIMPANZE', 'HIPOPOTAMO', 'LEOPARDO', 'BALEIA'],
    Frutas: ['MELANCIA', 'MORANGO', 'ABACAXI', 'LARANJA', 'TANGERINA', 'ABACATE']
};

const MAX_ERROS = 6;

// Desenho da forca em ASCII para customização
const FORCA_ASCII = [
    `
     +---+
     |   |
         |
         |
         |
         |
    =========`,
    `
     +---+
     |   |
     O   |
         |
         |
         |
    =========`,
    `
     +---+
     |   |
     O   |
     |   |
         |
         |
    =========`,
    `
     +---+
     |   |
     O   |
    /|   |
         |
         |
    =========`,
    `
     +---+
     |   |
     O   |
    /|\\  |
         |
         |
    =========`,
    `
     +---+
     |   |
     O   |
    /|\\  |
    /    |
         |
    =========`,
    `
     +---+
     |   |
     O   |
    /|\\  |
    / \\  |
         |
    =========`
];

// Função para remover acentos e facilitar a comparação
function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

// Fluxo principal do jogo
async function iniciarJogo() {
    console.clear();
    console.log("=======================================");
    console.log("🔺 BEM-VINDO AO JOGO DA FORCA EM JS 🔺");
    console.log("=======================================");

    const nomeJogador = await question("\nDigite o seu nome: ");
    let placarAcumulado = 0;
    let continuarJogando = true;

    while (continuarJogando) {
        placarAcumulado += await jogarRodada(nomeJogador);
        
        console.log(`\nPlacar Atual de ${nomeJogador}: ${placarAcumulado} pontos.`);
        const resposta = await question("\nDeseja jogar novamente? (S/N): ");
        if (resposta.trim().toUpperCase() !== 'S') {
            continuarJogando = false;
        }
    }

    console.log(`\nObrigado por jogar, ${nomeJogador}! Sua pontuação final foi de ${placarAcumulado} pontos.`);
    rl.close();
}

// Lógica de uma rodada isolada
async function jogarRodada(nomeJogador) {
    console.clear();
    console.log("--- SELEÇÃO DE CATEGORIA ---");
    const categorias = Object.keys(BANCO_DE_PALAVRAS);
    
    categorias.forEach((cat, index) => {
        console.log(`${index + 1} - ${cat}`);
    });

    let escolha = await question("\nEscolha o número da categoria desejada: ");
    let indexCategoria = parseInt(escolha) - 1;

    // Validação da escolha da categoria
    while (isNaN(indexCategoria) || indexCategoria < 0 || indexCategoria >= categorias.length) {
        escolha = await question("Opção inválida. Escolha um número válido da categoria: ");
        indexCategoria = parseInt(escolha) - 1;
    }

    const categoriaEscolhida = categorias[indexCategoria];
    const listaPalavras = BANCO_DE_PALAVRAS[categoriaEscolhida];
    
    // Sorteia uma palavra da categoria
    const palavraOriginal = listaPalavras[Math.floor(Math.random() * listaPalavras.length)];
    const palavraNormalizada = normalizarTexto(palavraOriginal);

    let letrasTentadas = new Set();
    let erros = 0;

    while (erros < MAX_ERROS) {
        console.clear();
        console.log(`Categoria atual: ${categoriaEscolhida}`);
        console.log(FORCA_ASCII[erros]);

        // Exibe a palavra mascarada (ex: J _ V _ S C R I P T)
        let exibicaoPalavra = "";
        for (let i = 0; i < palavraOriginal.length; i++) {
            const letraAtualNormalizada = normalizarTexto(palavraOriginal[i]);
            if (letrasTentadas.has(letraAtualNormalizada)) {
                exibicaoPalavra += palavraOriginal[i] + " ";
            } else {
                exibicaoPalavra += "_ ";
            }
        }
        
        console.log(`\nPalavra: ${exibicaoPalavra.trim()}`);
        console.log(`Tentativas feitas: [ ${Array.from(letrasTentadas).join(", ")} ]`);
        console.log(`Erros restantes: ${MAX_ERROS - erros}`);

        // Verifica se o jogador adivinhou a palavra completa
        const ganhou = palavraNormalizada.split("").every(letra => letrasTentadas.has(letra));
        if (ganhou) {
            console.log("\n🎉 PARABÉNS! Você acertou a palavra!");
            // Cálculo da pontuação baseado nas tentativas salvas
            const pontosGanhos = (MAX_ERROS - erros) * 10;
            exibirFimRodada(nomeJogador, "VITÓRIA", palavraOriginal, pontosGanhos);
            return pontosGanhos;
        }

        // Captura o chute do usuário
        let chute = await question("\nChute uma letra: ");
        chute = normalizarTexto(chute).trim();

        if (chute.length !== 1 || !/[A-Z]/.test(chute)) {
            await question("Por favor, digite apenas uma única letra válida. (Pressione Enter)");
            continue;
        }

        if (letrasTentadas.has(chute)) {
            await question("Você já tentou essa letra antes! (Pressione Enter)");
            continue;
        }

        letrasTentadas.add(chute);

        // Se errou a letra
        if (!palavraNormalizada.includes(chute)) {
            erros++;
            console.log(`❌ A letra '${chute}' não existe na palavra.`);
            await new Promise(r => setTimeout(r, 800)); // Pequena pausa dramática
        }
    }

    // Fim de jogo por esgotamento de erros
    console.clear();
    console.log(FORCA_ASCII[MAX_ERROS]);
    console.log("\n💥 FIM DE JOGO! Suas tentativas acabaram.");
    exibirFimRodada(nomeJogador, "DERROTA", palavraOriginal, 0);
    return 0;
}

function exibirFimRodada(nome, resultado, palavra, pontos) {
    console.log("\n=======================================");
    console.log(`Jogador: ${nome}`);
    console.log(`Resultado da Rodada: ${resultado}`);
    console.log(`A palavra correta era: ${palavra}`);
    console.log(`Pontuação obtida nesta rodada: ${pontos} pontos`);
    console.log("=======================================");
}

// Executa o script principal
iniciarJogo();