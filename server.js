const express = require('express');
var http = require('http').Server(express);
const socketIO = require('socket.io');
var shortid = require('shortid');

var ClientLookUp = {};
var ClientId = {};

const PORT = process.env.PORT || 3000;

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


  const io = socketIO(server);

//Connection socket
io.on('connection', function(socket){
//Connection process

var CurrentPlayer;

    socket.on('JOIN_ROOM', function(pack){

        CurrentPlayer = {
            name : pack.name,
            id : socket.id,
            position:'0;0;0',
            rotation:'0;0;0;0'
        };

    
    ClientLookUp[CurrentPlayer.id] = CurrentPlayer;

    socket.emit('JOIN_SUCCESS', CurrentPlayer);

    console.log(ClientLookUp);
    //Instantiate for all players online the new player
    socket.broadcast.emit('SPAWN_PLAYER', CurrentPlayer);

    for(Client in ClientLookUp){
        if(ClientLookUp[Client].id != CurrentPlayer.id){
        socket.emit('SPAWN_PLAYER', ClientLookUp[Client]);
        }
    }

    });

    socket.on('MOVE_AND_ROT', function(pack){
        
        var data = {
            id:CurrentPlayer.id,
            position:pack.position,
            rotation:pack.rotation
        };

         ClientLookUp[CurrentPlayer.id].position = pack.position;
         ClientLookUp[CurrentPlayer.id].rotation = pack.rotation;


        socket.broadcast.emit('UPDATE_POS_AND_ROT', data);

        console.log(data);
    })

});

// http.listen(3000, function(){
//     console.log('server listen on at 3000 port')
// })