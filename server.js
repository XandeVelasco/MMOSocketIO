var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io');
var shortid = require('shortid');

var ClientLookUp = {};
var ClientId = {};


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

    })

});

// http.listen(3000, function(){
//     console.log('server listen on at 3000 port')
// })

var porta = process.env.PORT || 8080;
app.listen(porta);