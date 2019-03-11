const express = require('express');
const app = express();
app.set('view engine','ejs');
const router = require('./controller');
const path = require('path');
var target1 = path.join(__dirname,'./public');
var target2 = path.join(__dirname,'./upload');
app.use(express.static(target1));
app.use(express.static(target2));
app.listen(3001,'127.0.0.1');
app.get('/',router.showIndex);
app.get('/:albumName',router.showAlbum);
app.post('/newFolder',router.newFolder);
app.post('/rename',router.rename);
app.post('/deleteFolder',router.deleteFolder);
app.post('/uploadImg',router.doPost);
app.post('/deleteImg',router.deleteImg);
//404
app.use(function (req, res) {
    res.render("err");
});
