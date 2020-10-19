const express = require('express'),
    albumRoutes = require('./albums'),
    fs = require('fs');

var router = express.Router();

// To be able to view the main page with the directory (localhost:port/main)
router.get('/main', (req, res)=>{
    res.redirect('/')
})
//load the main page 
router.get('/', (req, res) => {
    fs.readFile('client/index.html', (err, html) => {
        if (err) {
            throw err;
        }
        res.write(html);
        res.end();
    })
});

router.get('/albums', albumRoutes.getListOfAlbums); 
router.get('/albums/:id', albumRoutes.getListOfPhotos); 
router.post('/albums', albumRoutes.createAlbum); 
router.delete('/albums/:id', albumRoutes.deleteAlbum); 
router.post('/photo', albumRoutes.createPhotoInAlbum); 


module.exports = router;