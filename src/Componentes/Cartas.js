import { useEffect, useMemo, useState } from 'react';
import Carta from './Carta';

const RECORDES_KEY = 'memory-game-best-scores';
const HISTORICO_KEY = 'memory-game-attempt-history';
const MAX_HISTORICO = 12;

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

const DIFICULDADES = [
  { id: 'facil', label: 'Fácil', pares: 4 },
  { id: 'medio', label: 'Médio', pares: 6 },
  { id: 'dificil', label: 'Difícil', pares: 8 },
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

function criarBaralho(dificuldadeId) {
  const dificuldade = DIFICULDADES.find((item) => item.id === dificuldadeId);
  const animaisDoJogo = ANIMAIS.slice(0, dificuldade.pares);

  return embaralhar(
    animaisDoJogo.flatMap((animal) => [
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

function lerStorage(key, fallback) {
  try {
    const dados = window.localStorage.getItem(key);
    return dados ? JSON.parse(dados) : fallback;
  } catch {
    return fallback;
  }
}

function salvarStorage(key, dados) {
  try {
    window.localStorage.setItem(key, JSON.stringify(dados));
  } catch {
    return;
  }
}

function formatarTempo(segundos) {
  if (typeof segundos !== 'number') {
    return '--:--';
  }

  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;

  return `${String(minutos).padStart(2, '0')}:${String(resto).padStart(2, '0')}`;
}

function formatarMelhorPontuacao(pontuacao) {
  if (!pontuacao) {
    return 'Ainda sem recorde';
  }

  if (typeof pontuacao.tempo !== 'number') {
    return `${pontuacao.movimentos} movimentos`;
  }

  return `${pontuacao.movimentos} movimentos em ${formatarTempo(
    pontuacao.tempo
  )}`;
}

function ordenarRanking(tentativas) {
  return [...tentativas].sort((a, b) => {
    if (a.movimentos !== b.movimentos) {
      return a.movimentos - b.movimentos;
    }

    return a.tempo - b.tempo;
  });
}

export default function Cartas() {
  const [dificuldade, setDificuldade] = useState('medio');
  const [cartas, setCartas] = useState(() => criarBaralho('medio'));
  const [selecionadas, setSelecionadas] = useState([]);
  const [movimentos, setMovimentos] = useState(0);
  const [tempo, setTempo] = useState(0);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [mensagem, setMensagem] = useState('Encontre todos os pares.');
  const [recordes, setRecordes] = useState(() => lerStorage(RECORDES_KEY, {}));
  const [historico, setHistorico] = useState(() =>
    lerStorage(HISTORICO_KEY, [])
  );
  const [resultadoFinal, setResultadoFinal] = useState(null);

  const dificuldadeAtual = DIFICULDADES.find(
    (item) => item.id === dificuldade
  );

  const paresEncontrados = useMemo(
    () => cartas.filter((carta) => carta.status === 'matched').length / 2,
    [cartas]
  );

  const totalPares = dificuldadeAtual.pares;
  const jogoCompleto = paresEncontrados === totalPares;
  const melhorPontuacao = recordes[dificuldade];
  const historicoDaDificuldade = historico.filter(
    (tentativa) => tentativa.dificuldadeId === dificuldade
  );
  const rankingDaDificuldade = ordenarRanking(historicoDaDificuldade).slice(
    0,
    5
  );

  useEffect(() => {
    if (!jogoIniciado || jogoCompleto) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTempo((tempoAtual) => tempoAtual + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [jogoCompleto, jogoIniciado]);

  function registrarResultado(finalMovimentos, finalTempo) {
    const recordeAtual = recordes[dificuldade];
    const bateuRecorde =
      !recordeAtual ||
      finalMovimentos < recordeAtual.movimentos ||
      (finalMovimentos === recordeAtual.movimentos &&
        typeof recordeAtual.tempo === 'number' &&
        finalTempo < recordeAtual.tempo);
    const novaTentativa = {
      id: `${Date.now()}-${dificuldade}`,
      dificuldade: dificuldadeAtual.label,
      dificuldadeId: dificuldade,
      movimentos: finalMovimentos,
      tempo: finalTempo,
      pares: totalPares,
      data: new Date().toISOString(),
    };
    const novoHistorico = [novaTentativa, ...historico].slice(0, MAX_HISTORICO);
    const melhorFinal = bateuRecorde
      ? { movimentos: finalMovimentos, tempo: finalTempo }
      : recordeAtual;

    setHistorico(novoHistorico);
    salvarStorage(HISTORICO_KEY, novoHistorico);

    setResultadoFinal({
      ...novaTentativa,
      bateuRecorde,
      recordeAnterior: recordeAtual,
      melhor: melhorFinal,
      ranking: ordenarRanking(
        novoHistorico.filter(
          (tentativa) => tentativa.dificuldadeId === dificuldade
        )
      ).slice(0, 5),
    });

    if (bateuRecorde) {
      const novosRecordes = {
        ...recordes,
        [dificuldade]: {
          movimentos: finalMovimentos,
          tempo: finalTempo,
          data: novaTentativa.data,
        },
      };

      setRecordes(novosRecordes);
      salvarStorage(RECORDES_KEY, novosRecordes);
    }
  }

  function iniciarJogo(novaDificuldade = dificuldade) {
    setDificuldade(novaDificuldade);
    setCartas(criarBaralho(novaDificuldade));
    setSelecionadas([]);
    setMovimentos(0);
    setTempo(0);
    setJogoIniciado(false);
    setBloqueado(false);
    setResultadoFinal(null);
    setMensagem('Novo jogo embaralhado.');
  }

  function fecharResultado() {
    setResultadoFinal(null);
  }

  function selecionarCarta(position) {
    const cartaAtual = cartas[position];

    if (
      bloqueado ||
      jogoCompleto ||
      !cartaAtual ||
      cartaAtual.status !== 'hidden' ||
      selecionadas.includes(position)
    ) {
      return;
    }

    if (!jogoIniciado) {
      setJogoIniciado(true);
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
      const proximoMovimentos = movimentos + 1;
      setBloqueado(true);
      setMovimentos(proximoMovimentos);

      const [primeiraPosition, segundaPosition] = novasSelecionadas;
      const primeiraCarta = cartas[primeiraPosition];
      const segundaCarta = cartas[segundaPosition];
      const encontrouPar = primeiraCarta.matchId === segundaCarta.matchId;
      const ultimoPar =
        encontrouPar && paresEncontrados + 1 === totalPares;

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

        if (ultimoPar) {
          const tempoFinal = tempo;
          setJogoIniciado(false);
          setMensagem(
            `Você concluiu o jogo em ${proximoMovimentos} movimentos.`
          );
          registrarResultado(proximoMovimentos, tempoFinal);
          return;
        }

        setMensagem(
          encontrouPar
            ? `Par encontrado: ${primeiraCarta.name}.`
            : 'Essas cartas não formam um par.'
        );
      }, encontrouPar ? 450 : 850);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 text-stone-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-5 border-b border-stone-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Jogo da memória
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">
              Animais
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              className="grid grid-cols-3 rounded-lg border border-stone-200 bg-white p-1"
              aria-label="Escolha de dificuldade"
              role="group"
            >
              {DIFICULDADES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`h-10 rounded-md px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                    dificuldade === item.id
                      ? 'bg-stone-950 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                  disabled={bloqueado}
                  onClick={() => iniciarJogo(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => iniciarJogo()}
              disabled={bloqueado}
            >
              Reiniciar
            </button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-5" aria-label="Placar">
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <span className="block text-sm text-stone-500">Dificuldade</span>
            <strong className="mt-1 block text-2xl font-semibold">
              {dificuldadeAtual.label}
            </strong>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <span className="block text-sm text-stone-500">Tempo</span>
            <strong className="mt-1 block text-2xl font-semibold">
              {formatarTempo(tempo)}
            </strong>
          </div>
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
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <span className="block text-sm text-stone-500">Melhor</span>
            <strong className="mt-1 block text-xl font-semibold">
              {melhorPontuacao
                ? `${melhorPontuacao.movimentos} / ${
                    typeof melhorPontuacao.tempo === 'number'
                      ? formatarTempo(melhorPontuacao.tempo)
                      : '--:--'
                  }`
                : '--'}
            </strong>
          </div>
        </section>

        <div
          className="rounded-lg border border-stone-200 bg-white p-4"
          aria-live="polite"
        >
          <span className="block text-sm text-stone-500">Status</span>
          <strong className="mt-1 block text-base font-semibold text-stone-800">
            {mensagem}
          </strong>
        </div>

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

        <section className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
                Ranking local
              </p>
              <h2 className="text-xl font-semibold text-stone-950">
                Melhores tentativas em {dificuldadeAtual.label}
              </h2>
            </div>
            <span className="text-sm text-stone-500">
              {historicoDaDificuldade.length} tentativa(s)
            </span>
          </div>

          {rankingDaDificuldade.length > 0 ? (
            <ol className="mt-4 grid gap-2">
              {rankingDaDificuldade.map((tentativa, index) => (
                <li
                  key={tentativa.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md bg-stone-50 px-3 py-2"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-stone-950 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>
                    <strong className="block text-sm text-stone-900">
                      {tentativa.movimentos} movimentos
                    </strong>
                    <span className="text-sm text-stone-500">
                      {new Date(tentativa.data).toLocaleDateString('pt-BR')}
                    </span>
                  </span>
                  <strong className="text-sm text-stone-900">
                    {formatarTempo(tentativa.tempo)}
                  </strong>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 rounded-md bg-stone-50 p-3 text-sm text-stone-600">
              Conclua uma partida para registrar sua primeira tentativa.
            </p>
          )}
        </section>
      </section>

      {resultadoFinal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resultado-titulo"
        >
          <section className="max-h-full w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
                  Partida concluída
                </p>
                <h2
                  id="resultado-titulo"
                  className="mt-2 text-2xl font-semibold text-stone-950"
                >
                  {resultadoFinal.bateuRecorde
                    ? 'Novo recorde!'
                    : 'Você encontrou todos os pares.'}
                </h2>
              </div>

              <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-stone-200 text-xl leading-none text-stone-600 transition hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                aria-label="Fechar resumo da partida"
                onClick={fecharResultado}
              >
                x
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <span className="block text-sm text-stone-500">
                  Dificuldade
                </span>
                <strong className="mt-1 block text-xl">
                  {resultadoFinal.dificuldade}
                </strong>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <span className="block text-sm text-stone-500">Tempo</span>
                <strong className="mt-1 block text-xl">
                  {formatarTempo(resultadoFinal.tempo)}
                </strong>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <span className="block text-sm text-stone-500">
                  Movimentos
                </span>
                <strong className="mt-1 block text-xl">
                  {resultadoFinal.movimentos}
                </strong>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <span className="block text-sm text-stone-500">Pares</span>
                <strong className="mt-1 block text-xl">
                  {resultadoFinal.pares}
                </strong>
              </div>
            </div>

            <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
              {resultadoFinal.bateuRecorde
                ? `Você superou o recorde anterior: ${
                    resultadoFinal.recordeAnterior
                      ? formatarMelhorPontuacao(resultadoFinal.recordeAnterior)
                      : 'primeira pontuação registrada'
                  }.`
                : `Seu melhor nessa dificuldade continua sendo ${formatarMelhorPontuacao(
                    resultadoFinal.melhor
                  )}.`}
            </p>

            <section className="mt-5">
              <h3 className="text-lg font-semibold text-stone-950">
                Ranking desta dificuldade
              </h3>
              <ol className="mt-3 grid gap-2">
                {resultadoFinal.ranking.map((tentativa, index) => (
                  <li
                    key={tentativa.id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md bg-stone-50 px-3 py-2"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-stone-950 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>
                      <strong className="block text-sm text-stone-900">
                        {tentativa.movimentos} movimentos
                      </strong>
                      <span className="text-sm text-stone-500">
                        {tentativa.pares} pares encontrados
                      </span>
                    </span>
                    <strong className="text-sm text-stone-900">
                      {formatarTempo(tentativa.tempo)}
                    </strong>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                onClick={() => iniciarJogo(resultadoFinal.dificuldadeId)}
              >
                Jogar novamente
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                onClick={fecharResultado}
              >
                Fechar
              </button>
            </div>

            <div className="mt-4">
              <span className="block text-sm font-medium text-stone-600">
                Escolher nova dificuldade
              </span>
              <div className="mt-2 grid grid-cols-3 rounded-lg border border-stone-200 bg-white p-1">
                {DIFICULDADES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`h-10 rounded-md px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                      resultadoFinal.dificuldadeId === item.id
                        ? 'bg-stone-950 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                    onClick={() => iniciarJogo(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
