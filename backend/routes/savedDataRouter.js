const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken'); 
const validateUser = require('../middlewares/validateUser'); 

const { saveDrawnData, getSavedData, getSavedDataById, deleteSavedData } = require('../controllers/savedDataController');


router.post('/save', verifyToken, validateUser, saveDrawnData);


router.get('/all', verifyToken, validateUser, getSavedData);


router.get('/:id', verifyToken, validateUser, getSavedDataById);


router.delete('/:id', verifyToken, validateUser, deleteSavedData);

module.exports = router;
