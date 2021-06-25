//import { FormEvent, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { useRoom } from '../hooks/useRoom'
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

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
      endedAt: new Date(),
      roomIsOpen: false
    })
    history.push('/')
  }
  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }


  async function handleCheckQuestionAsAnswered(questionId:string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId:string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  function handleGoHomePage() {
    return history.push('/')
  }
 
  return (
    <div id="page-room">
        <header>
          <div className='content'>
            <img src={logoImg} alt="Let me Ask Logo" onClick={handleGoHomePage}/>
            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={handleEndRoom}>Encerrar sala </Button>
            </div>
          </div>
        </header>
        <main className="content">
          <div className="room-title">
            <h1>{title}</h1>
            {questions.length > 0 && <span>{questions.length} perguntas</span>}
          </div>

          <div className="question-list">
            {questions.map(question => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && (
                  <>
                    <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Destaque a pergunta" />
                  </button>
                  </>
                  )}
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