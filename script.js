/*jshint asi:true */

var socket = (function() {
  var _ws = null
  var _lastResp = {}
  var _allResps = []
  var _status = false
  var _toSend = []
  var _toClose = false
  var msgFunc = function (msg) {}
  var openFunc = function () {}

  function openSocketConnection(end) {
    try {
      if (_status === false) {
        _ws = new WebSocket(end)
      }
      else {
        throw 'Já conectado'
      }
    } catch (e) {
      _ws = null
      console.log('ERRO: Falha ao conectar, verifique o endereço ou o estado do host.');
      return false
    } finally {
      _ws.onopen = function () {
        _status = true
        openFunc()
        while (_toSend.length !== 0 ) {
          setTimeout(
            _ws.send(_toSend.shift()),
            100
          )
        }
        if (_toClose === true  & _toSend.length ===0) {
          _ws.close()
          _ws = null
          _status = false
          _toClose = false
        }
      }
      _ws.onmessage = function (msg) {
        _lastResp = msg
        _allResps.push(msg)
        msgFunc(msg)
      }
      _ws.onerror = function (e) {
        console.log('ERROR: '+e)
        _ws = null
        _status = false
      }
      _ws.onclose = function (e) {
        console.log('Conexão encerrada')
      }
      return true
    }
  }

  function closeSocketConnection() {
    if (_toSend.length > 0 || _status === false) {
      _toClose = true
      console.log('Conexão será encerrada')
      return false
    }else {
      _ws.close()
      _ws = null
      _status = false
      return true
    }
  }

  function setRespCallback(cb) {
    if (typeof cb === 'function') {
      msgFunc = cb
      return true
    }
    console.log('ERRO: Deve ser tipo "function".');
    return false
  }

  function setOpenCallback(cb) {
    if (typeof cb === 'function') {
      openFunc = cb
      return true
    }
    console.log('ERRO: Deve ser tipo "function".');
    return false
  }

  function getStatus() {
    if (_ws !== null) {
      return true
    }
    return false
  }

  function sendMessage(msg) {
    if (_ws !== null & _status !== false & _toSend.length === 0) {
      _ws.send(msg)
      return true
    }
    _toSend.push(msg)
    return false
  }

  function getMsg() {
    return _lastResp.data
  }

  function getAllMsgs() {
    return _allResps
  }

  return {
    start: openSocketConnection,
    stop: closeSocketConnection,
    status: getStatus,
    enviar: sendMessage,
    resp: getMsg,
    allResps: getAllMsgs,
    respFunc: setRespCallback,
    conFunc: setOpenCallback
  }
})()


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
