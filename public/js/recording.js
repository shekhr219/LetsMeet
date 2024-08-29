// Toggles meeting recording on or off.
var recordState = 1;
function recordMeeting() {
  if (recordState == 1) {
    startRecording();
  } else {
    stopRecording();
  }
}
// Starts recording the screen and audio.
let stream = null,
  audio = null,
  mixedStream = null,
  chunks = [],
  recorder = null;
async function startRecording() {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    });
    recordState = 0;
    document.getElementById("recordControl").style.color = "#fd6f13";
  } catch (err) {
    console.error(err);
  }
  if (stream && audio) {
    mixedStream = new MediaStream([
      ...stream.getTracks(),
      ...audio.getTracks(),
    ]);
    recorder = new MediaRecorder(mixedStream);
    recorder.ondataavailable = handleDataAvailable;
    recorder.onstop = handleStop;
    recorder.start(1000);
  }
}

// Handles the recorded data chunks.
function handleDataAvailable(e) {
  chunks.push(e.data);
}

// Stops recording and saves the recorded video.
function handleStop(e) {
  const blob = new Blob(chunks, { type: "video/mp4" });
  chunks = [];
  stream.getTracks().forEach((track) => track.stop());
  audio.getTracks().forEach((track) => track.stop());
  var element = document.createElement("a");
  element.href = URL.createObjectURL(blob);
  element.download = "video.mp4";
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function stopRecording() {
  recordState = 1;
  document.getElementById("recordControl").style.color = "#000000";
  recorder.stop();
}
