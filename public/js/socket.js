const socket = io("/");
var myPeerId;
var peerList = [];
var peer = new Peer(undefined, {
  path: "/peerjs",
  secure: true,
  host: "/",
  port: "443",
});
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
  myPeerId = id;
  peerList[id] = USERNAME;
});

socket.on("user-connected", (peerId) => {
  connecToOther(peerId, myVideoStream);
});

var sharedStream;

// Connects to another user using WebRTC peer-to-peer connection.
const connecToOther = (peerId, stream) => {
  const call = peer.call(peerId, stream);
  peerList[call.peer] = "";
  var i = 1;
  call.on("stream", (userVideoStream) => {
    if (i <= 1) {
      addVideo(call.peer, "", userVideoStream);
      var conn = peer.connect(peerId);
      conn.on("open", function () {
        conn.send(myPeerId + "," + USERNAME);
      });
    }
    i++;
  });

  if (shareState == 1) {
    const call1 = peer.call(peerId, sharedStream);
  }
};

// Handles incoming calls from other peers and sets up the connection.
var myVideoStream1;
peer.on("call", (call) => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      myVideoStream1 = stream;
      call.answer(stream);
      var conn = peer.connect(call.peer);
      conn.on("open", function () {
        conn.send(myPeerId + "," + USERNAME);
      });
    });

  if (peerList.hasOwnProperty(call.peer) == false) {
    var i = 1;
    call.on("stream", (userVideoStream) => {
      if (i <= 1) {
        addVideo(call.peer, "", userVideoStream);
      }
      i++;
    });
    peerList[call.peer] = "";
  } else {
    call.on("stream", (userVideoStream) => {
      changeMainVideo(userVideoStream);
      streamBack = userVideoStream;
      document.getElementById("shareControl").onclick = getSharedVideo;
      document.getElementById("shareText").innerHTML = "Back in";
    });
  }
});

// Handles incoming data connections from other peers.
var peerName;
peer.on("connection", function (conn) {
  conn.on("data", function (data) {
    var message = data.split(",");
    peerList[message[0]] = message[1];
    document.getElementById(message[0]).innerHTML = message[1];
  });
});
