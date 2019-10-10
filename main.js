const video = document.getElementById('video')

// load models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),  // a fast model for in-browser rendering
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // box around face, know where face is
  faceapi.nets.faceExpressionNet.loadFromUri('/models')  // read face expressions (happy, sad, etc)
])
  .then(startVideo)


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
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = {
    width: video.width,
    height: video.height
  }
  faceapi.matchDimensions(canvas, displaySize)  // more accurate detection with canvas
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces( // gets all faces inside of webcam image
      video,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks()
      .withFaceExpressions()  // will determine expression of face
    console.log(detections)
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) // clears entire canvas befor re-drawing
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})