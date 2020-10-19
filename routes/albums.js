const fs = require('fs');
const dataPath = './data/albums.json';
const validator = require('validator');

// helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }
        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }
        callback();
    });
};



module.exports = {

    getListOfAlbums: function (req, res) {
        readFile(data => res.json(data), true)
    },

    getListOfPhotos: function (req, res) {
        readFile(data =>{
            if(data[req.params.id])
                res.json(data[req.params.id].pictures)
            else{
                res.sendStatus(400)
            }
            }, 
             true);
    },

    createAlbum: function (req, res) {
        readFile(data => {
            let albumId = String(+Object.keys(data).pop() + 1);
            if(isNaN(albumId)){
                albumId=0
            }
            let { albumName: name, albumCategory: type } = req.body
            //validator
            if(!validator.isAlphanumeric(name)){
                res.status(400).send("Album name can only contain letters and numbers.") 
            }else{
                data[albumId] = { name, type, pictures: {} }
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send({ [albumId]: data[albumId] });
                });
            }
           
        },
            true);
    },


    deleteAlbum: function (req, res) {
        readFile(data =>{
            if(data[req.params.id]){
                delete data[req.params.id]
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.sendStatus(204)
                });
            }
            else
                res.sendStatus(400);
            }, 
             true);
    },

    createPhotoInAlbum: function (req, res) {

        readFile(data => {
            const albumId= req.body.albumId
            let photosObj=data[albumId].pictures
            let id = String(+Object.keys(photosObj).pop() + 1);
            if(isNaN(id)){
                id=0
            }
            let { photoName: name, artistName: photographer, link: link } = req.body

                data[albumId].pictures[id] = {name, photographer, link,id }
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send({ [id]: photosObj });
                });

        },
            true);
    },

  
};