# Jogo da Memória

Um jogo da memória com tema de animais, feito em React. Este projeto nasceu como um estudo simples e foi refinado para ter uma apresentação mais limpa, responsiva e organizada para portfólio.

## Preview

O jogo exibe 16 cartas embaralhadas. O objetivo é encontrar todos os 8 pares com o menor número possível de movimentos.

## Funcionalidades

- Cartas embaralhadas a cada novo jogo.
- Contador de movimentos.
- Contador de pares encontrados.
- Feedback visual para acertos, erros e conclusão.
- Bloqueio temporário durante a comparação de duas cartas.
- Layout responsivo para desktop e mobile.
- Interface acessível com botões, rótulos e foco visível.

## Tecnologias

- React
- Create React App
- Tailwind CSS

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

O comando gera a versão otimizada na pasta `build`.

## Estrutura

- `src/Componentes/Cartas.js`: controla o estado e as regras do jogo.
- `src/Componentes/Carta.js`: renderiza cada carta individual.
- `src/index.css`: estilos globais e diretivas do Tailwind.
- `public/animais`: imagens usadas nas cartas.

## Próximos passos

- Adicionar escolha de dificuldade.
- Salvar melhor pontuação localmente.
- Criar uma tela final com resumo da partida.
