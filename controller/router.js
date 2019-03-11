const file = require('../models')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')
const dayJs = require('dayjs')

module.exports.showIndex = function (req, res) {
  file.getAllAlbums((allAlbums) => {
    res.render('index', {
      'albums': allAlbums
    })
  })
}
module.exports.showAlbum = function (req, res) {
  let albumName = req.params.albumName
  file.getAllPhotos(albumName, (photos) => {
    res.render('album', {
      'albumName': albumName,
      'photos': photos
    })
  })
}
module.exports.doPost = function (req, res) {
  let form = new formidable.IncomingForm()
  form.multiples = true

  let targetFile = path.join(__dirname, '../temp-up')
  let final = path.join(__dirname, '../upload')
  form.uploadDir = targetFile

  form.parse(req,  (err, fields, files) => {
    if (err) {
      throw err
    }

    files['picture'].forEach((file, i) => {
      let oldPath = file.path
      let ext = path.extname(file.name)
      let name = file.name.replace(ext, dayJs().format('_YYYY-MM-DD_HH:mm:ss') + ext)
      let newPath = path.join(final, fields['folderName'], name)


      fs.rename(oldPath, newPath, err=>{
        if(err) throw err;
        else if (files['picture'].length === i + 1) {
          res.redirect('/' + fields['folderName'])
        }
      })

    })
  })
}
module.exports.newFolder = function (req, res) {
  let form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, file) {
    if (err) throw err
    let target = path.join(__dirname, '../upload', fields['flodername'])
    fs.mkdir(target, (err) => {
      if (err) throw err
      res.send('1')
    })
  })
}
module.exports.rename = function (req, res) {
  let form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, file) {
    if (err) throw err
    let oldPath = path.join(__dirname, '../upload', fields.oldname)
    let newPath = path.join(__dirname, '../upload', fields.newname)
    fs.rename(oldPath, newPath, (err) => {
      if (err) throw err
      res.send('1')
    })
  })
}
module.exports.deleteFolder = function (req, res) {
  let form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, file) {
    if (err) throw err
    let targetfloder = path.join(__dirname, '../upload', fields['flodername'])
    fsExtra.remove(targetfloder, (err) => {
      if (err) throw err
      res.send('1')
    })
  })
}
module.exports.deleteImg = function (req, res) {
  let form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, file) {
    if (err) throw err
    let img = path.basename(fields.imgSrc)
    let target = path.join(__dirname, '../upload', fields['folderName'], img)
    fsExtra.remove(target, (err) => {
      if (err) throw err
      res.send('1')
    })
  })
}
