// Toggles screen sharing on or off.
var shareState = 0;
var videoTrack;
var streamBack;
function shareScreen() {
  if (shareState == 0) {
    startShareScreen();
  } else {
    stopShareScreen();
  }
}

// Starts screen sharing by getting display media and broadcasting to peers.
function startShareScreen() {
  navigator.mediaDevices
    .getDisplayMedia({
      video: {
        cursor: "always",
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })
    .then((stream) => {
      sharedStream = stream;
      shareState = 1;
      document.getElementById("shareControl").style.color = "#fd6f13";
      var peerToCall = Object.keys(peerList) + "";
      const peerArray = peerToCall.split(",");
      for (var i = 1; i <= peerArray.length; i++) {
        const call = peer.call(peerArray[i], stream);
        changeMainVideo(stream);
      }
      videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = function () {
        stopShareScreen();
      };
    })
    .catch((err) => {
      console.log("unable to share screen " + err);
    });
}

// Stops screen sharing and resets the main video to the local stream.
function stopShareScreen() {
  shareState = 0;
  document.getElementById("shareControl").style.color = "#000000";
  videoTrack.stop();
  changeMainVideo(myVideoStream);
  socket.emit("stop-screen-share", myPeerId);
}

// Handles receiving a "no-share" event to stop screen sharing.
socket.on("no-share", (peerId) => {
  changeMainVideo(myVideoStream);
  document.getElementById("shareControl").onclick = shareScreen;
  document.getElementById("shareText").innerHTML = "Share";
});

// Changes the main video to a shared stream.
function getSharedVideo() {
  changeMainVideo(streamBack);
}
