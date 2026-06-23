const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const BANCO_DE_PALAVRAS = {
    Tecnologia: [
        { palavra: 'JAVASCRIPT', dica: 'Linguagem da Web que estamos usando agora' },
        { palavra: 'COMPUTADOR', dica: 'Máquina usada para programar e navegar' },
        { palavra: 'INTERNET', dica: 'Rede mundial de computadores' },
        { palavra: 'ALGORITMO', dica: 'Sequência de passos lógicos para resolver um problema' },
        { palavra: 'PROGRAMACAO', dica: 'O ato de escrever códigos para o computador' },
        { palavra: 'SOFTWARE', dica: 'A parte lógica do computador (programas)' },
        { palavra: 'HARDWARE', dica: 'A parte física do computador (peças)' }
    ],
    Paises: [
        { palavra: 'BRASIL', dica: 'Minha bandeira é verde e amarela com um círculo azul cheio de estrelas e a frase "Ordem e Progresso"' },
        { palavra: 'PORTUGAL', dica: 'Minha bandeira é verde e vermelha com um escudo e uma esfera armilar dourada no centro' },
        { palavra: 'ARGENTINA', dica: 'Minha bandeira tem três faixas azul, branca e azul, com um sol no meio' },
        { palavra: 'ALEMANHA', dica: 'Minha bandeira tem três faixas horizontais preta, vermelha e amarela' },
        { palavra: 'AUSTRALIA', dica: 'Minha bandeira tem fundo azul escuro com a Union Jack no canto e estrelas brancas' },
        { palavra: 'INDONESIA', dica: 'Minha bandeira tem apenas duas faixas: vermelha em cima e branca embaixo' },
        { palavra: 'MOCAMBIQUE', dica: 'Minha bandeira é a única no mundo que tem um AK-47 desenhado nela' }
    ],
    Animais: [
        { palavra: 'CACHORRO', dica: 'O melhor amigo do homem' },
        { palavra: 'ELEFANTE', dica: 'Possui uma tromba enorme e orelhas grandes' },
        { palavra: 'GIRAFA', dica: 'Tem um pescoço extremamente longo' },
        { palavra: 'CHIMPANZE', dica: 'Primata muito inteligente e parecido com o homem' },
        { palavra: 'HIPOPOTAMO', dica: 'Animal pesado que adora ficar na lama/água' },
        { palavra: 'LEOPARDO', dica: 'Felino veloz e cheio de pintas' },
        { palavra: 'BALEIA', dica: 'O maior mamífero dos oceanos' }
    ],
    Frutas: [
        { palavra: 'MELANCIA', dica: 'Grande, verde por fora e vermelha por dentro' },
        { palavra: 'MORANGO', dica: 'Fruta vermelha pequena com sementes por fora' },
        { palavra: 'ABACAXI', dica: 'Tem uma coroa e casca cheia de espinhos' },
        { palavra: 'LARANJA', dica: 'Fruta cítrica muito usada para fazer suco no café da manhã' },
        { palavra: 'TANGERINA', dica: 'Também conhecida como mexerica ou ponkan' },
        { palavra: 'ABACATE', dica: 'Fruta verde usada para fazer guacamole' }
    ]
};

const MAX_ERROS = 6;

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

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

async function iniciarJogo() {
    console.clear();
    console.log("=======================================");
    console.log("BEM-VINDO AO JOGO DA FORCA EM JS");
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

async function jogarRodada(nomeJogador) {
    console.clear();
    console.log("--- SELEÇÃO DE CATEGORIA ---");
    const categorias = Object.keys(BANCO_DE_PALAVRAS);
    
    categorias.forEach((cat, index) => {
        console.log(`${index + 1} - ${cat}`);
    });

    let escolha = await question("\nEscolha o número da categoria desejada: ");
    let indexCategoria = parseInt(escolha) - 1;

    while (isNaN(indexCategoria) || indexCategoria < 0 || indexCategoria >= categorias.length) {
        escolha = await question("Opção inválida. Escolha um número válido da categoria: ");
        indexCategoria = parseInt(escolha) - 1;
    }

    const categoryEscolhida = categorias[indexCategoria];
    const listaPalavras = BANCO_DE_PALAVRAS[categoryEscolhida];
    
    const objetoPalavra = listaPalavras[Math.floor(Math.random() * listaPalavras.length)];
    const palavraOriginal = objetoPalavra.palavra;
    const dicaPalavra = objetoPalavra.dica;
    const palavraNormalizada = normalizarTexto(palavraOriginal);

    let letrasTentadas = new Set();
    let erros = 0;
    let usouDica = false;

    while (erros < MAX_ERROS) {
        console.clear();
        console.log(`Categoria atual: ${categoryEscolhida}`);
        console.log(FORCA_ASCII[erros]);

        if (usouDica) {
            console.log(`DICA DO JOGO: ${dicaPalavra}`);
        } else {
            console.log(`Precisa de ajuda? Digite 'DICA' para revelar uma pista (Custa 15 pontos!)`);
        }

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

        const ganhou = palavraNormalizada.split("").every(letra => letrasTentadas.has(letra));
        if (ganhou) {
            console.log("\nPARABÉNS! Você acertou a palavra!");
            let pontosGanhos = (MAX_ERROS - erros) * 10;
            if (usouDica) pontosGanhos = Math.max(5, pontosGanhos - 15); // Penalidade da dica
            exibirFimRodada(nomeJogador, "VITÓRIA", palavraOriginal, pontosGanhos);
            return pontosGanhos;
        }

        let chute = await question("\nChute uma letra: ");
        chute = chute.trim().toUpperCase();

        if (chute === 'DICA') {
            if (usouDica) {
                await question("Você já usou a dica nesta rodada! (Pressione Enter)");
            } else {
                usouDica = true;
                await question("Dica ativada! Você perderá 15 pontos na vitória desta rodada. (Pressione Enter)");
            }
            continue;
        }

        chute = normalizarTexto(chute);

        if (chute.length !== 1 || !/[A-Z]/.test(chute)) {
            await question("Por favor, digite apenas uma única letra válida. (Pressione Enter)");
            continue;
        }

        if (letrasTentadas.has(chute)) {
            await question("Você já tentou essa letra antes! (Pressione Enter)");
            continue;
        }

        letrasTentadas.add(chute);

        if (!palavraNormalizada.includes(chute)) {
            erros++;
            console.log(`A letra '${chute}' não existe na palavra.`);
            await new Promise(r => setTimeout(r, 800));
        }
    }

    console.clear();
    console.log(FORCA_ASCII[MAX_ERROS]);
    console.log("\nFIM DE JOGO! Suas tentativas acabaram.");
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

iniciarJogo();