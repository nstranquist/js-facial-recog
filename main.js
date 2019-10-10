const video = document.getElementById('video')



function startVideo() {
  navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  )

  if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
    navigator.getUserMedia({
      video: {}
    },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  } else {
    navigator.mediaDevices.getUserMedia({
      video: {}
    }).then(stream => video.srcObject = stream)
      .catch(err => console.error(err));
  }

  //navigator.getUserMedia = (
  //  { video: {} },
  //  stream => video.srcObject = stream,
  //  err => console.error(err)
  //)
}

startVideo()