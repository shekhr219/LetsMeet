// Gets video and audio stream from the user's device and initializes the video elements.
const videoGrid = document.getElementById("video-grid");
async function getMedia() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myVideoStream = stream;
    addVideo("my-label-mini-vid", USERNAME, myVideoStream);
    changeMainVideo(stream);
  } catch (err) {}
}
getMedia();
