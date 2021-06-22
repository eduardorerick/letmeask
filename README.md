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


