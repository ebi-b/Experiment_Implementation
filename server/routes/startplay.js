const express = require('express');
const router = express.Router();
let mturk_id=""

router.get('/', (req, res) => {
    res.render('startplay');
    mturk_id = req.query.mturkid;
    
})

router.post('/', (req, res) => {
    res.redirect(`/baseline?mturkid=${mturk_id}`)
 
 });

module.exports = router;