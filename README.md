# Jogo da Memória

Um jogo da memória com tema de animais, feito em React. Este projeto nasceu como um estudo simples e foi refatorado recentemente para ser mais responsivo e organizado.

## Preview

O jogo exibe cartas embaralhadas com o objetivo de encontrar todos os pares no menor número possível de movimentos e no menor tempo possível.

## Funcionalidades

- Escolha de dificuldade: fácil, médio e difícil.
- Cartas embaralhadas a cada novo jogo.
- Cronômetro de partida.
- Contador de movimentos.
- Contador de pares encontrados.
- Melhor pontuação salva localmente por dificuldade.
- Ranking local com histórico de tentativas.
- Feedback visual para acertos, erros e conclusão.
- Popup final com resumo da partida, recorde, ranking e ações rápidas.
- Bloqueio temporário durante a comparação de duas cartas.
- Layout responsivo para desktop e mobile.
- Interface acessível com botões, rótulos e foco visível.

## Tecnologias

- React
- Vite
- Tailwind CSS
- LocalStorage

## Como rodar

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm start
```

O app ficará disponível em `http://localhost:3000`.

## Build de produção

```bash
npm run build
```

O comando gera a versão otimizada na pasta `dist`.

## Estrutura

- `src/Componentes/Cartas.jsx`: controla o estado, as regras do jogo, dificuldade, tempo, recordes e ranking.
- `src/Componentes/Carta.jsx`: renderiza cada carta individual.
- `src/index.css`: estilos globais e diretivas do Tailwind.
- `public/animais`: imagens usadas nas cartas.
