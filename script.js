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
