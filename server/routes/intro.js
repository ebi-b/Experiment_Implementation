const express = require('express');
const router = express.Router();
let mturk_id=""

router.get('/', (req, res) => {
    res.render('intro');
    req.session.mturk_id = req.query.mturkid;
    //console.log("In the intro router");
})

// router.post('/', (req, res) => {
//    console.log("reached the page");
//    //res.redirect("https://github.com/pugjs/pug/issues/1355")
//    //res.redirect('/consentform');
// });
router.post('/', (req, res) => {
    //console.log("reached the page");
    res.redirect(`/tutorial1?mturkid=${req.session.mturk_id}`)
    //res.send(req.body)
    //res.redirect("https://github.com/pugjs/pug/issues/1355")
    //res.redirect('/welcome');
 });

module.exports = router;
