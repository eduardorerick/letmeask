import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import logoImg from '../assets/images/logo.svg'
import emptyImg from '../assets/images/empty-room.svg'
import { database } from '../services/firebase'
import '../styles/room.scss'
//Route path="/RoomList" component={RoomList} />
//Record para tipar objetos, e dentro de <> fica o tipo da chave



type RoomType = {
  roomId:string;
  title: string;
  roomIsOpen?: boolean;
}[]



export function RoomList() {
  const history = useHistory();
  const [rooms, setRooms] = useState<RoomType>([])

  useEffect(() => {
    const dbRef = database.ref(`rooms`);
    dbRef.once('value', rooms => {
      const dbRoom: object = rooms.val() ?? {}
      const parsedRooms = Object.entries(dbRoom).map(([key,value]) => {
        return {
          roomId: key,
          title: value.title,
          roomIsOpen: value.roomIsOpen
        }
      })
      console.log(dbRoom)
      console.log(Object.entries(dbRoom))
      console.log(parsedRooms)

      setRooms(parsedRooms)
    })

  }, [])

  function handleGoHomePage() {
    return history.push('/')
  }
  
  function handleGoToRoom(questionId:string, isOpen: boolean) {
    if(isOpen) {
      return history.push(`rooms/${questionId}`)
    } else {
      return window.alert('A sala já fechou!')
    }

    //   return history.push(`rooms/${questionId}`)
  }
  
  return (
    <div id="page-room">
        <header>
          <div className='content'>
          <img src={logoImg} alt="Let me Ask Logo" onClick={handleGoHomePage}/>
          </div>
        </header>
        <main className="content">
          <div className="question-list">
            <div className='room-box-div'>
              {rooms.length !== 0 ? 
                rooms.map((item: any) => {return(<div className={`room-item-div ${item.roomIsOpen? '': 'closed'}`} onClick={() => handleGoToRoom(item.roomId, item?.roomIsOpen)}key={item.roomId} >{item.title}</div>)}) 
                : (
                <div className="empty-list"> 
                  <h1>Não temos salas no momento</h1>
                  <img src={emptyImg} alt="Empty Room" />
                </div>)}
            </div>
          </div>
        </main>
    </div>
  )
}