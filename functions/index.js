const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const Vision = require('@google-cloud/vision')
const vision = Vision()

// const im = require('imagemagick')
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const os = require('os')
const gcs = require('@google-cloud/storage')()
// const spawn = require('child-process-promise').spawn

// const ExifImage = require('exif').ExifImage
var sizeOf = require('image-size')

exports.cameraUpload = functions.storage.object().onChange(event => {
  const file = event.data // The Storage object.
  const filePath = file.name

  // const fileBucket = object.bucket // The Storage bucket that contains the file.
  // const filePath = object.name // File path in the bucket.
  const contentType = file.contentType // File content type.
  const resourceState = file.resourceState // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
  // const metageneration = object.metageneration // Number of times metadata has been generated. New objects have a value of 1.

  if (!contentType.startsWith('image/')) {
    console.log('This is not image.')
    return false
  }
  if (resourceState === 'not_exists') {
    console.log('This is a deletion event.')
    return false
  }

  // Download file from bucket.
  const randomFileName = crypto.randomBytes(20).toString('hex') + path.extname(filePath)
  var tempLocalFile = path.join(os.tmpdir(), randomFileName)
  const bucket = gcs.bucket(file.bucket)
  return bucket.file(file.name).getMetadata().then(metadata => {
    console.log(metadata)
    return bucket.file(file.name).download({ destination: tempLocalFile }).then(() => {
      return new Promise(function (resolve, reject) {
        var dimensions = sizeOf(tempLocalFile)
        var data = {
          file: file,
          ts: -Date.now(),
          meta: {
            width: dimensions.width,
            height: dimensions.height
          }
        }

        if (!dimensions) {
          return reject('No dimension')
        }
        resolve(data)
      })
    })

    /*
  // Get Metadata from image.
  return spawn('identify', ['-verbose', tempLocalFile], { capture: ['stdout', 'stderr'] }).then(result => {
    console.log(result.stdout)
    const metadata = imageMagickOutputToObject(result.stdout)
    // Save metadata to realtime datastore.
    var data = {
      file: file,
      ts: -Date.now(),
      meta: metadata
    }
    return admin.database().ref('camera').push(data).then(() => {
      console.log('Wrote to:', filePath, 'data:', data)
    })
  })
  */
  }).then(data => {
    return admin.database().ref('camera').push(data).then(() => {
      console.log('Wrote database:', data)
    })
  }).then(() => {
    // Cleanup temp directory after metadata is extracted
    // Remove the file from temp directory
    fs.unlinkSync(tempLocalFile)
    console.log('cleanup successful!')
  })
})

/*
function makeKeyFirebaseCompatible(key) {
  return key.replace(/\./g, '*')
}

function imageMagickOutputToObject(output) {
  let previousLineIndent = 0
  const lines = output.match(/[^\r\n]+/g)
  lines.shift() // Remove First line
  lines.forEach((line, index) => {
    const currentIdent = line.search(/\S/)
    line = line.trim()
    if (line.endsWith(':')) {
      lines[index] = makeKeyFirebaseCompatible(`"${line.replace(':', '":{')}`)
    } else {
      const split = line.replace('"', '\\"').split(': ')
      split[0] = makeKeyFirebaseCompatible(split[0])
      lines[index] = `"${split.join('":"')}",`
    }
    if (currentIdent < previousLineIndent) {
      lines[index - 1] = lines[index - 1].substring(0, lines[index - 1].length - 1)
      lines[index] = new Array(1 + (previousLineIndent - currentIdent) / 2).join('}') + ',' + lines[index]
    }
    previousLineIndent = currentIdent
  })
  output = lines.join('')
  output = '{' + output.substring(0, output.length - 1) + '}' // remove trailing comma.
  output = JSON.parse(output)
  console.log('Metadata extracted from image', output)
  return output
}
*/

/* disable vision api
exports.detectFace = functions.database.ref('/camera/{pushId}/file')
  .onCreate(event => {
    // Grab the current value of what was written to the Realtime Database.
    var val = event.data.val()
    if (val) {
      var gcsPath = 'gs://' + val.bucket + '/' + val.name
      // var imageUri = event.data.val()
      console.log('Start ' + event.params.pushId + ' in ' + gcsPath)

      // vision.faceDetection({ source: { imageUri: imageUri } })
      return vision.faceDetection({ source: { imageUri: gcsPath } })
        .then((results) => {
          var faceData = results[0].faceAnnotations
          return event.data.ref.parent.child('faces').set(faceData).then(() => {
            console.log('Success Set Database')
          })
        })
        .catch(err => {
          console.log('Error Set Database: ' + err)
        })
    } else {
      console.log('File not found in ' + event.params.pushId)
      return false
    }
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
  })
*/

const cognitive = require('cognitive-services')
const cognitiveConfig = {
  face: {
    endpoint: 'westcentralus.api.cognitive.microsoft.com',
    apiKey: '27d41fb26c384306b36f0a1133755f37'
  },
  emotion: {
    endpoint: 'westus.api.cognitive.microsoft.com',
    apiKey: '207c22b48c074e51a6b9d9f2af727b5c'
    // apiKey: "41435c1dc7fc40cda4a8cc83d603a060"
  }
}

exports.detectCognitive = functions.database.ref('/camera/{pushId}/file')
  .onCreate(event => {
    // Grab the current value of what was written to the Realtime Database.
    var val = event.data.val()
    var photoURL = val.mediaLink
    if (val) {
      console.log('Cognitive detection', event.params.pushId, photoURL)

      const face = cognitive.face({
        apiKey: cognitiveConfig.face.apiKey,
        endpoint: cognitiveConfig.face.endpoint
      })

      const parameters = {
        returnFaceId: 'true',
        returnFaceLandmarks: 'false',
        returnFaceAttributes: 'age,gender,smile'
        // returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses'
      }
      const headers = {
        'Content-type': 'application/json'
      }
      const body = {
        url: photoURL
      }
      return face.detect({
        parameters,
        headers,
        body
      })
        .then((response) => {
          console.log(response)
          return event.data.ref.parent.child('detect').set(response)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  })
