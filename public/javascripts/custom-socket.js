const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const peers = {};
// const myPeer = new Peer(undefined, {
//     host:'/',
//     port:'3002'
// });


const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
    addVideoStream(myVideo,stream);

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document .createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
    });


}).catch(err => {
    console.log(err);
});

// myPeer.on('open', id => {
// });
socket.emit('join-room', ROOM_ID, USER_ID);


socket.on('user-connected', userId => {
    console.log(userId);
});

socket.on('user-disconnected', userId => {
    if(peers[userId]){
        peers[userId].close();
    }
});


function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream);
    const video =  document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });

    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
}

function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    videoGrid.append(video);
}