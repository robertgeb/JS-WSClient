# JS-WSClient
Simple Websocket client implementation

## Usage

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

Abrindo conexão: `socket.start()`

    //Exemplo:
    socket.start('ws://echo.websocket.org');

Fechando conexão: `socket.stop()`

    //Exemplo:
    socket.stop();

Definindo callback de mensagem do socket: `socket.respFunc(algumaFuncao(msg))`

    //Exemplo
    socket.respFunc(function (msg){
        console.log(msg.data);
    });

Definindo callback de conexão aberta: `socket.conFunc(algumaFuncao(msg))`

    //Exemplo
    socket.conFunc(function (){
        console.log('Conectado.');
    });

Enviando mensagem: `socket.enviar('Oi')`

    //Exemplo
    socket.enviar({
        'action': 'getSource',
        'param': 'someParam'
    });
    //Exemplo 2
    socket.enviar('Hi');

Lendo a ultima mensagem recebida: `socket.resp()`

    //Exemplo
    var resp = socket.resp()
    if(typeof resp === undefined)
      console.log('Nenhuma mensagem recebida');
    else if(resp === 'Hi')
      console.log('Servidor disse "Hi"');

Lendo todas as mensagens recebidas: `socket.allResps()`

    //Exemplo
    var allMsgs = socket.allResps()
    for(var i = 0; i < allMsgs.length; i++)
      console.log(allMsgs[i].data)
