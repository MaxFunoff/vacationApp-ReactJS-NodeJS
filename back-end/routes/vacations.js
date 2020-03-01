const express = require('express');
const router = express.Router();
const handler = require('../handlers/vacations')
const auth = require('../auth/jwtAuth')
const authAdmin = require('../auth/jwtAuthAdmin')
const multer = require('multer')

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


/* GET vacations listing. */
router.get('/', handler.allVacations);
router.get('/:id', handler.byID);

/* POST vacations listing */
router.post('/', authAdmin, upload.single('image'), handler.createVacation)
router.post('/:id/add', auth, handler.addVacationToUser)



/* PUT vacations listing */
router.put('/:id/refund', auth, handler.refundVacationFromUser)



module.exports = router;
