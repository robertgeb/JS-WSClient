/*jshint asi:true */

/*    Usando o socketClient   */

window.onload = function () {
  var wsEnd = 'ws://echo.websocket.org'

  socket.respFunc(
    function (msg) {                  //Definindo uma func para trabalhar a msg do servidor
      if (msg.data == 'Oi') {
        console.log('Saudações recebidas')
        console.log(socket.resp())
      }
    }
  )

  socket.conFunc(
    function () {                           //Definindo uma func para ocorrer quando conectar com sucesso
      console.log('Conectado')
    }
  )

  socket.start(wsEnd)   //Se conectando com o server

  socket.enviar('Oi')               //Enviando mensagem
  for (var i = 0; i < 20; i++) {
    socket.enviar('Mensagem '+i)
  }
  console.log('Saudacoes enviadas')

  if (socket.status() === false) {
    console.log('Desconectado.')      //Verificando estado da conexão
  }

  //
  // socket.stop()                        //Desligando conexão
  //

  console.log(socket.resp())        //Obtendo ultima resposta recebida do servidor
  // NOTE: undefined pois ainda n recebeu nada

  // console.log(socket.allResps())    //Obtendo array com todas as respostas recebidas até o momento

  setTimeout(function () {
    console.log('Apos 2 segundos essas são todas as mensagens:')
    var resps = socket.allResps()      //Obtendo respotas depois de 2 segundos
    for (var i = 0; i < resps.length; i++) {
      console.log(resps[i].data)
    }
  }, 2000)

  setTimeout(function () {
    console.log('Apos 10 segundos essas são todas as mensagens:')
    var resps = socket.allResps()      //Obtendo respotas depois de 10 segundos
    for (var i = 0; i < resps.length; i++) {
      console.log(resps[i].data)
    }
  }, 10000)

}
