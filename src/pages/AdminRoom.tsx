//import { FormEvent, useState } from 'react'
import { useParams } from 'react-router'
import { useRoom } from '../hooks/useRoom'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Questions'
import { RoomCode } from '../components/RoomCode'
//import { useAuth } from '../hooks/useAuth'
//import { database } from '../services/firebase'
import '../styles/room.scss'

//Record para tipar objetos, e dentro de <> fica o tipo da chave



type RoomParams = {
  id: string;
}

export function AdminRoom() {
  //const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  
  const { questions, title } = useRoom(roomId)

  return (
    <div id="page-room">
        <header>
          <div className='content'>
            <img src={logoImg} alt=""/>
            <div>
              <RoomCode code={roomId} />
              <Button isOutlined>Encerrar sala </Button>
            </div>
          </div>
        </header>
        <main className="content">
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && <span>{questions.length} perguntas</span>}
          </div>

          <div className="question-list">
            {questions.map(question => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                />
              )
            })}
          </div>
        </main>
    </div>
  )
}