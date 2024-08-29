// Adds a new video element to the video grid.
function addVideo(labelMiniVidId, username, stream) {
  const video = document.createElement("video");
  video.className = "vid";
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  video.addEventListener("click", () => {
    changeMainVideo(stream);
  });
  const labelMiniVid = document.createElement("div");
  labelMiniVid.id = labelMiniVidId;
  labelMiniVid.className = "label-mini-vid";
  labelMiniVid.innerHTML = username;
  const miniVid = document.createElement("div");
  miniVid.className = "mini-vid";
  miniVid.append(video);
  miniVid.append(labelMiniVid);
  videoGrid.append(miniVid);

  countUser();
}

// Counts the number of video elements and updates the participant count.
function countUser() {
  let numb = videoGrid.childElementCount;
  document.getElementById("participant").innerHTML = numb;
}

// Changes the main video element's source to the given stream.
const mainVid = document.getElementById("main-video");
function changeMainVideo(stream) {
  mainVid.srcObject = stream;
}
