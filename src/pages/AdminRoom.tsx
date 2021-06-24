//import { FormEvent, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { useRoom } from '../hooks/useRoom'
import logoImg from '../assets/images/logo.svg'

import deleteImg from '../assets/images/delete.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Questions'
import { RoomCode } from '../components/RoomCode'
//import { useAuth } from '../hooks/useAuth'
//import { database } from '../services/firebase'
import '../styles/room.scss'
import { database } from '../services/firebase'

//Record para tipar objetos, e dentro de <> fica o tipo da chave



type RoomParams = {
  id: string;
}

export function AdminRoom() {
  //const { user } = useAuth();
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;
  
  const { questions, title } = useRoom(roomId)

  async function handleEndRoom () {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })
    history.push('/')
  }
  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

 
  return (
    <div id="page-room">
        <header>
          <div className='content'>
            <img src={logoImg} alt=""/>
            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={handleEndRoom}>Encerrar sala </Button>
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
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Question>
              )
            })}
          </div>
        </main>
    </div>
  )
}