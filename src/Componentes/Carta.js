export default function Carta({ carta, index, clickhandler }) {
/* eslint-disable no-unused-vars */
    const cartaClassName = carta.status ? 'ativo' : ''

    return (
        <div className={`carta ${carta.status}`} onClick={() => clickhandler(index)}>
            <img src={carta.img} alt={carta.name} />
        </div>
    );
    /* eslint-enable no-unused-vars */
} 