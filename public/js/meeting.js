function leaveMeeting() {
  let text = "Are you sure?";
  if (confirm(text) == true) {
    socket.emit("leave-meeting", myPeerId, USERNAME);
    peer.disconnect();
    location.assign("/");
  }
}

// Listens for the "user-leave" event and updates the UI when a user leaves.
socket.on("user-leave", (peerId, peerName) => {
  alert(peerName + " left the meeting");
  var node = document.getElementById(peerId).parentNode;
  videoGrid.removeChild(node);
  countUser();
});
