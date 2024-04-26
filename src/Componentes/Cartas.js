import { useState, useRef } from 'react'
import Carta from './Carta'

export default function Cartas () {

    const [cartas, setCartas] = useState([
        { id: 0, name: 'Galinha Filhote', status: '', img: '/animais/01.png'  },
        { id: 0, name: 'Galinha Filhote', status: '', img: '/animais/01.png'  },
        { id: 1, name: 'Urso', status: '', img: '/animais/02.png'  },
        { id: 1, name: 'Urso', status: '', img: '/animais/02.png'  },
        { id: 2, name: 'Raposa', status: '', img: '/animais/03.png'  },
        { id: 2, name: 'Raposa', status: '', img: '/animais/03.png'  },
        { id: 3, name: 'Guaxinim', status: '', img: '/animais/04.png'  },
        { id: 3, name: 'Guaxinim', status: '', img: '/animais/04.png'  },
        { id: 4, name: 'Panda', status: '', img: '/animais/05.png'  },
        { id: 4, name: 'Panda', status: '', img: '/animais/05.png'  },
        { id: 5, name: 'Galinha Filhotinha', status: '', img: '/animais/06.png'  },
        { id: 5, name: 'Galinha Filhotinha', status: '', img: '/animais/06.png'  },
        { id: 6, name: 'Golfin', status: '', img: '/animais/07.png'  },
        { id: 6, name: 'Golfin', status: '', img: '/animais/07.png'  },
        { id: 7, name: 'Hipopótamo', status: '', img: '/animais/08.png'  },
        { id: 7, name: 'Hipopótamo', status: '', img: '/animais/08.png'  },
    ].sort(() => Math.random() - .4))

        const [prevCartaState, setPrevCartaState] = useState(-1)
        const prevIndex = useRef(-1)

        const checagem = (currentCarta) => {
        if(cartas[currentCarta].id === cartas[prevCartaState].id){
            cartas[prevCartaState].status = 'ativo'
            cartas[currentCarta].status = 'ativo'
            setPrevCartaState(-1)
        }else{
            cartas[currentCarta].status = 'ativo'
            setCartas([...cartas])
            setTimeout(() => {
                setPrevCartaState(-1)
                cartas[currentCarta].status = 'desmarcado'
                cartas[prevCartaState].status = 'desmarcado'
                setCartas([...cartas])
            }, 1000);
        }
    }

    const clickhandler = (index) => {
        
        if(index !== prevIndex.current){
            if(cartas[index].status === 'ativo'){
                alert('virado')
            }else{
                if(prevCartaState === -1){
                    prevIndex.current = index
                    cartas[index].status = 'ativo'
                    setCartas([...cartas])
                    setPrevCartaState(index)
                }else{
                    checagem(index)
                    prevIndex.current = -1
                }
            }
        }else{
                alert('Carta já selecionada')
            }

        }

        return (
        <div className="container">
            { cartas.map((carta, index) => {
                return <Carta carta={carta} key={index} index={index} clickhandler={clickhandler} /> 
            })}
        </div>
    );
}