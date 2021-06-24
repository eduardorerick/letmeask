import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import logoImg from '../assets/images/logo.svg'
import { RoomCode } from '../components/RoomCode'
import { database } from '../services/firebase'
import '../styles/room.scss'

//Record para tipar objetos, e dentro de <> fica o tipo da chave

type RoomParams = {
  id: string;
}

type RoomType = {
  roomId:string;
  title: string;
}[]


export function RoomList() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [rooms, setRooms] = useState<RoomType>([])

  useEffect(() => {
    const dbRef = database.ref(`rooms`);
    dbRef.once('value', rooms => {
      const dbRoom: object = rooms.val() ?? {}
      const parsedTitles = Object.entries(dbRoom).map(([key,value]) => {
        return {
          roomId: key,
          title: value.title
        }
      })
      console.log(dbRoom)
      console.log(Object.entries(dbRoom))
      console.log(parsedTitles)

      setRooms(parsedTitles)
    })

    
  }, [])
  console.log()
  console.log(rooms)
  return (
    <div id="page-room">
        <header>
          <div className='content'>
            <img src={logoImg} alt=""/>
            <RoomCode code={roomId} />
          </div>
        </header>
        <main className="content">
          <div className="room-title">
            <h1>Sala</h1>
          </div>
          <div className="question-list">
          <ul>
            {rooms.map((item: any) => {return(<h1 key={item.roomId}>{item.title}</h1>)})}
          </ul>
          </div>
        </main>
    </div>
  )
}