<h1> LetMeAsk  </h1>

<p>Aplicativo desenvolvido durante a NLW </p>


<h4>Aqui vou fazer um breve resumo do que foi feito em cada dia</h4>


<h1> Dia 1 </h1>
<h2> Configuração de ambiente </h2>
<p> Foi dado inicio ao aplicativo React com <code>create-react-app</code></p>
<p>Tópicos que eu considerei importantes no dia:</p>
<ul>
  <li> Introdução ao Typescript </li>
  <li> Introdução ao Firebase </li>
  <li> Resumo sobre SPA </li>
  <li> Benefícios na utilizando de functions no React </li>
  <li> Introdução a Hooks </li>
</ul>


<h1> Dia 2 </h1>
<h2> Páginas iniciais e autenticação </h2>
<p> Uma bomba de conteúdo! Começamos com uma simples página com HTML e SCSS e então partimos para o início do método de autenticação. </p>
<p> Primeiro fizemos a integração do <code>react-router-dom</code> para navegar pelas páginas, então fizemos o método de login pelo google utilizando o firebase. Com uma função assíncrona <code>async function signInWithGoogle()</code> definimos o provedor como <code>const provider = firebase.auth.GoogleAuthProvider()</code> e definimos o resultado como <code>const result = await auth.signInWithPopup(provider)</code></p>
<p> Nesse ponto, se o cliente concluir a autenticação já temos um <code>result</code> com várias informações, que permite a gente a criar uma estrutura condicional para o nosso código, então podemos checar se o cliente tem foto, nome. </p>
     
      if (result.user) {
      const { displayName, photoURL, uid} = result.user;
      
      if(!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.')
      };

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      });
      };


<p> Se o usuário não possuir um nome e foto de perfil, a função retornará um erro com uma string, se ele tem todos os dados, a função vai "setar" o estado com os dados novos do usuário.</p>
<p>Para manter os dados do usuário caso ele atualize a página foi utilizado o <code>useEffect</code>, foi usado dentro da função um observador para garantir que o objeto Auth não esteja em um estado intermediário (como inicialização) ao identificar o usuário atual.

<p>Por fim, foi feito uma refatoração do código, todo o AuthContext foi passado para um arquivo TSX próprio, e foi criado também o arquivo UseAuth.js para simplificar o uso de hooks</p>

    import { useContext } from 'react';
    import { AuthContext } from '../contexts/AuthContext';

    export function useAuth() {
      const value = useContext(AuthContext)
      return value
    };

<h1> Dia 3 </h1>
<h2> Criando novas salas e novas perguntas</h2>

<p>Para criar uma nova sala no database do firebase precisamos da função 
  <code>firebase.database().ref()</code> que retorna uma referência, que é uma localização dentro da database do Firebase.
assim podemos escrever :</p>

      const roomRef = database.ref('rooms');

      const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
          })

<p>Dessa maneira, estamos passando para a database na localização "rooms" um objeto contendo <code>title</code> e <code>authorId</code> que foi passado pelo usuário. </p>

<p>Depois de feito o scss da Sala, foi criado um component RoomCode para apenas pegar o código. </p>
<p>Para ter acesso ao código utilizamos o useParams do react-router-dom e para poder guardar os valores precisamos definir uma constante:</p>
       
       const params = useParams();

<p>porém, precisamos definir quais são os parametros que queremos receber nessa rota.</p>
<p>então definimos:</p>

      type RoomParams = {
        id: string;
      }

então fica:

    const params = useParams<RoomParams>();

agora a função sabe quais parametros vai receber.

e agora usamos o componente criado e passamos esse parametro como uma prop: 

    <RoomCode code={params.id} />

Criamos uma pequena função para o botão de copiar o numero da sala

    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code)
      }


<p>O próximo passo é fazer o botão de enviar questões funcionar.</p>
<p>Para isso definidos um novo estado chamado newQuestion </p>

    const [newQuestion, setNewQuestion] = useState('')

e importamos também o user que guardamos com a função <code>signInWithGoogle()</code>

agora é só checar se a perguntava enviada tem mesmo algum conteúdo. 

    if (newQuestion.trim() === "") {
          return
        }

e verificar se o usuário está logado.

    if(!user) {
      throw new Error('You must be logged in');
    }

se passar por essas condições, definimos um objeto com os dados da nova pergunta e os dados do usuário. 


    const question = {
          content: newQuestion,
          author: {
            name: user?.name,
            avatar: user.avatar,
          },
          isHighlighted: false,
          isAnswered: false
        }

<code>isHighlighted</code> e <code>isAnswered</code> com valores booleanos para no futuro termos um controle da interface de acordo com seus valores.
	
então passamos esse objeto para a database com 

    await database.ref(`rooms/${roomId}/questions`).push(question)

E para consumir questões da database do Firebase vamos utilizar o hook <code>useEffect(() => {}, [])</code> para buscar no firebase os dados das perguntas.

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
          console.log(room.val());
        })
      }, []) 

Este evento <code>.on</code> irá disparar uma vez com os dados iniciais armazenados neste local e, em seguida, disparar novamente cada vez que os dados forem alterados.

O <code>console.log(room.val())</code> vai nos devolver um objeto com authorId:string, questions:object, title:string.

então definimos o tipo de objeto


    //Record para tipar objetos, e dentro de <> fica o tipo da chave
    type FirebaseQuestions = Record<string, {
      author: {
        name: string;
        avatar: string;
      }
      content: string; 
      isAnswered: boolean;
      isHighlighted: boolean;
    }>

então definimos a constante: 

    const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;

e transformamos esse objeto em um vetor com <code>Object.entries();</code>

    const parsedQuestions = Object.entries(firebaseQuestions)

dessa forma o objeto <code>{"name": "Eduardo", "cidade": "belém"}</code> vai retornar <code>[["name", "eduardo"], ["cidade","belém"]]</code>

então podemos utilizar o <code>.map(value => {})</code> tratando o <code>value</code> como um vetor, fazendo uma desestruturação sabendo que o primeiro valor é a chave e o segundo valor é o valor dessa chave. <code>[key, value]</code>


    const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted,
              isAnswered: value.isAnswered,
            }
          })

agora que temos um [] que contém um object com as perguntas, precisamos salvar isso em algum estado.

Criamos um para as perguntas e um para o titulo.  

    const [questions,setQuestions] = useState<Question[]>([])
    const [title, setTitle] = useState('')

e definimos o tipo do estado das perguntas: 

    type Question = {
      id:string;
      author: {
        name: string;
        avatar: string;
      }
      content: string; 
      isAnswered: boolean;
      isHighlighted: boolean;
    }

e passamos os valores para os estados ainda dentro de useEffect()

    setTitle(databaseRoom.title)
    setQuestions(parsedQuestions)



Agora basta usarmos essas informações na interface. 
