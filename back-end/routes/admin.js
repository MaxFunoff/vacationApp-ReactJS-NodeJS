const express = require('express');
const router = express.Router();
const handler = require('../handlers/admin')
const auth = require('../auth/jwtAuth')
const authAdmin = require('../auth/jwtAuthAdmin')
const multer = require('multer')


    // Multer "Settings"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true)
    else
        cb({status: 422, message: 'Wrong file type'}, false)
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})


    //Admin POST Vacation
router.post('/vacation', authAdmin, upload.single('image'), handler.createVacation)
