import { useEffect, useMemo, useState } from 'react';
import Carta from './Carta';

const ANIMAIS = [
  { id: 'galinha-filhote', name: 'Galinha filhote', img: '/animais/01.png' },
  { id: 'urso', name: 'Urso', img: '/animais/02.png' },
  { id: 'raposa', name: 'Raposa', img: '/animais/03.png' },
  { id: 'guaxinim', name: 'Guaxinim', img: '/animais/04.png' },
  { id: 'panda', name: 'Panda', img: '/animais/05.png' },
  { id: 'pintinho', name: 'Pintinho', img: '/animais/06.png' },
  { id: 'golfinho', name: 'Golfinho', img: '/animais/07.png' },
  { id: 'hipopotamo', name: 'Hipopótamo', img: '/animais/08.png' },
];

function embaralhar(cartas) {
  const cartasEmbaralhadas = [...cartas];

  for (let index = cartasEmbaralhadas.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cartasEmbaralhadas[index], cartasEmbaralhadas[randomIndex]] = [
      cartasEmbaralhadas[randomIndex],
      cartasEmbaralhadas[index],
    ];
  }

  return cartasEmbaralhadas;
}

function criarBaralho() {
  return embaralhar(
    ANIMAIS.flatMap((animal) => [
      {
        ...animal,
        matchId: animal.id,
        uid: `${animal.id}-a`,
        status: 'hidden',
      },
      {
        ...animal,
        matchId: animal.id,
        uid: `${animal.id}-b`,
        status: 'hidden',
      },
    ])
  ).map((carta, position) => ({ ...carta, position }));
}

export default function Cartas() {
  const [cartas, setCartas] = useState(() => criarBaralho());
  const [selecionadas, setSelecionadas] = useState([]);
  const [movimentos, setMovimentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [mensagem, setMensagem] = useState('Encontre todos os pares.');

  const paresEncontrados = useMemo(
    () => cartas.filter((carta) => carta.status === 'matched').length / 2,
    [cartas]
  );

  const totalPares = ANIMAIS.length;
  const jogoCompleto = paresEncontrados === totalPares;

  function reiniciarJogo() {
    setCartas(criarBaralho());
    setSelecionadas([]);
    setMovimentos(0);
    setBloqueado(false);
    setMensagem('Novo jogo embaralhado.');
  }

  function selecionarCarta(position) {
    const cartaAtual = cartas[position];

    if (
      bloqueado ||
      !cartaAtual ||
      cartaAtual.status !== 'hidden' ||
      selecionadas.includes(position)
    ) {
      return;
    }

    const novasSelecionadas = [...selecionadas, position];

    setCartas((cartasAtuais) =>
      cartasAtuais.map((carta) =>
        carta.position === position ? { ...carta, status: 'visible' } : carta
      )
    );
    setSelecionadas(novasSelecionadas);
    setMensagem('Continue procurando os pares.');

    if (novasSelecionadas.length === 2) {
      setBloqueado(true);
      setMovimentos((total) => total + 1);

      const [primeiraPosition, segundaPosition] = novasSelecionadas;
      const primeiraCarta = cartas[primeiraPosition];
      const segundaCarta = cartas[segundaPosition];
      const encontrouPar = primeiraCarta.matchId === segundaCarta.matchId;

      window.setTimeout(() => {
        setCartas((cartasAtuais) =>
          cartasAtuais.map((carta) => {
            if (!novasSelecionadas.includes(carta.position)) {
              return carta;
            }

            return {
              ...carta,
              status: encontrouPar ? 'matched' : 'hidden',
            };
          })
        );
        setSelecionadas([]);
        setBloqueado(false);
        setMensagem(
          encontrouPar
            ? `Par encontrado: ${primeiraCarta.name}.`
            : 'Essas cartas não formam um par.'
        );
      }, encontrouPar ? 450 : 850);
    }
  }

  useEffect(() => {
    if (jogoCompleto) {
      setMensagem(`Você concluiu o jogo em ${movimentos} movimentos.`);
    }
  }, [jogoCompleto, movimentos]);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 text-stone-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-5 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Jogo da memória
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">
              Animais
            </h1>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={reiniciarJogo}
            disabled={bloqueado}
          >
            Reiniciar
          </button>
        </header>

        <section className="grid gap-3 sm:grid-cols-3" aria-label="Placar">
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <span className="block text-sm text-stone-500">Movimentos</span>
            <strong className="mt-1 block text-2xl font-semibold">
              {movimentos}
            </strong>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <span className="block text-sm text-stone-500">Pares</span>
            <strong className="mt-1 block text-2xl font-semibold">
              {paresEncontrados}/{totalPares}
            </strong>
          </div>
          <div
            className="rounded-lg border border-stone-200 bg-white p-4"
            aria-live="polite"
          >
            <span className="block text-sm text-stone-500">Status</span>
            <strong className="mt-1 block text-base font-semibold text-stone-800">
              {mensagem}
            </strong>
          </div>
        </section>

        <section
          className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4"
          aria-label="Cartas do jogo"
        >
          {cartas.map((carta) => (
            <Carta
              key={carta.uid}
              carta={carta}
              disabled={bloqueado || jogoCompleto}
              onSelect={selecionarCarta}
            />
          ))}
        </section>
      </section>
    </main>
  );
}
