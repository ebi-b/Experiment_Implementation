const express = require('express');
const router = express.Router();
let mturk_id=""

router.get('/', (req, res) => {
    res.render('baseline_video');
    mturk_id=req.query.mturkid
    //console.log("In the baseline router");
})

router.post('/', (req, res) => {
    console.log("reached the baseline post page");
    res.redirect(`/startplay?mturkid=${mturk_id}`)
    //res.send(req.body)
    //res.redirect("https://github.com/pugjs/pug/issues/1355")
    //res.redirect('/welcome');
 });

module.exports = router;