export default function Carta({ carta, onSelect, disabled }) {
  const isVisible = carta.status === 'visible' || carta.status === 'matched';

  return (
    <button
      type="button"
      className={`group aspect-square rounded-lg border text-left shadow-sm transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 ${
        isVisible
          ? 'border-stone-300 bg-white'
          : 'border-stone-300 bg-stone-900 hover:-translate-y-0.5 hover:bg-stone-800'
      } ${carta.status === 'matched' ? 'ring-2 ring-emerald-400' : ''}`}
      aria-label={
        isVisible
          ? `${carta.name} revelado`
          : `Revelar carta ${carta.position + 1}`
      }
      aria-pressed={isVisible}
      disabled={disabled || carta.status === 'matched'}
      onClick={() => onSelect(carta.position)}
    >
      <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg p-2">
        <img
          className={`h-full w-full object-contain transition duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
          src={carta.img}
          alt={isVisible ? carta.name : ''}
          draggable="false"
        />
      </span>
    </button>
  );
}
