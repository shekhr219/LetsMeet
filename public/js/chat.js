// send text messages along with the sender's username, a random color for display, and a timestamp.
let text = $("#textchat");
$("#textchat").keydown((e) => {
  var hour = new Date().getHours();
  hour = ("0" + hour).slice(-2);
  var minute = new Date().getMinutes();
  minute = ("0" + minute).slice(-2);
  var time = hour + "." + minute;
  if (e.which == 13 && text.val().length !== 0) {
    socket.emit("message", text.val(), USERNAME, RANDOM_COLOR, time);
    text.val("");
  }
});

var uploadState = 0;
$("#sendMessage").click(() => {
  var hour = new Date().getHours();
  hour = ("0" + hour).slice(-2);
  var minute = new Date().getMinutes();
  minute = ("0" + minute).slice(-2);
  var time = hour + "." + minute;
  if (uploadState == 0) {
    socket.emit("message", text.val(), USERNAME, RANDOM_COLOR, time);
    text.val("");
  } else {
    uploadFile();
    const html =
      '<a href="uploaded-files/' +
      text.val() +
      '" target="_blank">' +
      text.val() +
      "</a>";
    socket.emit("message", html, USERNAME, RANDOM_COLOR, time);
    text.val("");
  }
});

// listens for new messages from the server and displays them in the chatroom with the sender's initial, username, message content, and time.
socket.on("createMessage", (message, sender, color, time) => {
  var initial = sender.substring(0, 1);
  $("#chatroom").append(`
<div id="left-chatroom" style="background-color: ${color}">
  <p class="profil">${initial}</p>
 <div class="mini-active"></div>
</div>
<div id="right-chatroom">
 <div id="message">
  <p id="message-user" style="color: #303030; font-weight: bold;">${sender}</p>
  <p id="message-text">${message}</p>
  </div>
</div>
 <p id="time-text" style="font-size:11px; color:#303030; margin-left: 55px; margin-top: 0px; padding-top: 0px; margin-bottom: 12px; color: white;">${time}</p>
 `);
  scrollToBottom();
});

// scrolls the chatroom to the bottom when new messages are added.
function scrollToBottom() {
  let d = $("#chatroom");
  d.scrollTop(d.prop("scrollHeight"));
}

// handles file selection and uploads, sending the file in chunks to the server and creating a downloadable link once uploaded.
function selectFile(val) {
  var filename = val.replace(/C:\\fakepath\\/i, "");
  document.getElementById("textchat").value = filename;
  uploadState = 1;
}
function uploadFile() {
  alert("uploading file...");
  uploadState = 0;
  const file = document.getElementById("file");
  const fileReader = new FileReader();
  const theFile = file.files[0];
  fileReader.onload = async (ev) => {
    const chunkCount =
      Math.floor(ev.target.result.byteLength / (1024 * 1024)) + 1;
    const CHUNK_SIZE = ev.target.result.byteLength / chunkCount;
    const fileName = theFile.name;
    for (let chunkId = 0; chunkId < chunkCount + 1; chunkId++) {
      const chunk = ev.target.result.slice(
        chunkId * CHUNK_SIZE,
        chunkId * CHUNK_SIZE + CHUNK_SIZE
      );
      await fetch("/upload", {
        method: "POST",
        headers: {
          "content-type": "application/octet-stream",
          "file-name": fileName,
          "content-length": chunk.length,
        },
        body: chunk,
      });
    }
  };
  fileReader.readAsArrayBuffer(theFile);
  file.value = "";
}
