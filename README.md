# Jogo da Forca em JavaScript

Este projeto é uma aplicação de terminal do clássico Jogo da Forca, desenvolvido inteiramente em JavaScript para rodar no ambiente Node.js.

## Desenvolvedor
* **Vivian Petrille da Silva.** 


## Regras do Jogo
1. O jogador deve tentar adivinhar uma palavra oculta letra por letra.
2. A cada erro, uma parte do corpo do personagem é desenhada na forca.
3. O jogador tem permissão para cometer no máximo **6 erros**. Se atingir o limite, o jogo acaba (Derrota).
4. Se o jogador descobrir todas as letras antes do limite de erros, ele vence a rodada (Vitória).


## Como Jogar e Funcionalidades Customizadas
1. Ao iniciar, digite o seu nome.
2. Escolha uma das 4 categorias disponíveis inserindo o número correspondente.
3. Digite uma letra por vez e pressione `Enter`.
4. **Normalização:** O jogo aceita letras maiúsculas ou minúsculas e ignora acentos (ex: chutar 'A' preenche tanto 'A' quanto 'Á' de forma inteligente).
5. **Validação:** Digitar caracteres especiais, números ou letras repetidas não consome tentativas e avisa o usuário.
6. **Pontuação:** O placar é acumulado por rodadas. Cada vitória soma `(Tentativas Restantes * 10)` pontos. Derrotas somam 0 pontos.
* **BÔNUS IMPLEMENTADO:** Sistema de Dicas habilitado! O jogador pode digitar "DICA" a qualquer momento para ver uma pista sobre a palavra secreta, sofrendo uma penalidade de 15 pontos na pontuação final caso vença.


## Como Executar

### Pré-requisitos
Certifique-se de ter o **Node.js** instalado em sua máquina.

### Passo a Passo
1. Clone este repositório para sua máquina local.
2. Abra o terminal na pasta raiz do projeto.
3. Inicialize os scripts (caso necessário) ou execute diretamente o comando de inicialização:

```bash
npm start
```

## Créditos — Fontes de Referência
Durante o desenvolvimento deste projeto, foram utilizadas as seguintes fontes e documentações como referência:

* **Documentação Oficial do Node.js (`readline`):** [https://nodejs.org/api/readline.html](https://nodejs.org/api/readline.html) — Utilizada para entender como capturar as entradas (inputs) do usuário via terminal de forma assíncrona.
* **MDN Web Docs (`String.prototype.normalize`):** [https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/normalize](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) — Utilizada para criar o sistema que remove os acentos das palavras automaticamente.
* **Aulas de Web/JavaScript:** Conteúdos e exemplos práticos ministrados em aula.

## Licença do Projeto
Este projeto está licenciado sob a **Licença MIT**. 

Isso significa que o código é livre para modificação, distribuição e uso. Para ler os termos completos, consulte o arquivo [LICENSE](./LICENSE) incluído na raiz deste repositório.