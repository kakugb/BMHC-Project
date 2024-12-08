const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partner.controller.js');
const checkAdminRole = require('../middlewares/checkRole.js');

router.post('/create', partnerController.createPartner);


router.get('/list', partnerController.getAllPartners); 


router.get('/:id', partnerController.singlePartner);
 

router.put('/update/:id', partnerController.updatePartner); 


router.delete('/delete/:id', partnerController.deletePartner); 


router.post('/filter', partnerController.filterPartners);

router.post('/filterByName', partnerController.filterPartnerByName);


module.exports = router;
