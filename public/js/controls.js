// Mutes or unmutes the local audio track.
function muteUnmute() {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    const html = `
              <i class="material-icons">&#xe02b;</i>
              <p class="label">Mic</p>
              `;
    document.getElementById("audioControl").innerHTML = html;
    myVideoStream.getAudioTracks()[0].enabled = false;
    myVideoStream1.getAudioTracks()[0].enabled = false;
  } else {
    const html = `
              <i class="material-icons">&#xe029;</i>
              <p class="label">Mic</p>
              `;
    document.getElementById("audioControl").innerHTML = html;
    myVideoStream.getAudioTracks()[0].enabled = true;
    myVideoStream1.getAudioTracks()[0].enabled = true;
  }
}

// Starts or stops the local video track.
function playStop() {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    myVideoStream1.getVideoTracks()[0].enabled = false;
    const html = `
     <i class="material-icons">&#xe04c;</i>
     <p class="label">Cam</p>
   `;
    document.getElementById("videoControl").innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    myVideoStream1.getVideoTracks()[0].enabled = true;
    const html = `
     <i class="material-icons">&#xe04b;</i>
    <p class="label">Cam</p>
     `;
    document.getElementById("videoControl").innerHTML = html;
  }
}
