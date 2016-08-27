/*
 * @Author: xw
 * @Date:   2016-08-27 13:03:24
 * @Last Modified by:   xw
 * @Last Modified time: 2016-08-27 13:52:39
 */

'use strict';
const net = require('net')
  // 保存 客户端
var clients = []

// 服务端，socket 代表与客户端的连接
// 客户端连接过来，就会执行
var server = net.createServer((socket) => {
  clients.push(socket)
  console.log(`Welcom 【${socket.remoteAddress}】 to 2080 聊天室...`)
    // 功能一：广播实现
  function boardcast(signal) {
    // 获取必要信息
    var username = signal.from;
    var message = signal.message;

    var send = {
      procoto: signal.procotol,
      from: username,
      message: message
    }
    clients.forEach(client => {
      client.write(JSON.stringify(send))
    })
  }
  // 客户端发送数据，就会执行
  socket.on('data', (trunk) => {
    // chunk：{"procotol":"boardcast","from":"张三","message":"弄啥咧！"}
    // chunk：{"procotol":"p2p","from":"张三","to":"李四","message":"弄啥咧！"}

    try {
      var signal = JSON.parse(trunk.toString().trim())
      var procotol = signal.procotol
      console.log(signal)
      switch (procotol) {
      case 'boardcast':
        boardcast(signal)
        break;
      case 'p2p':
        // boardcast()
        break;
      default:
        socket.write('协议未被定义...');
        break;
      }
    } catch (error) {
      socket.write('消息发送失败...');
    }
  })
})

var port = 2080
server.listen(port, (error) => {
  if (error) throw error
  console.log(`服务端启动正常，监听【${port}】端口`)
})
