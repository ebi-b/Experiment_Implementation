const express = require('express');
const router = express.Router();
let mturk_id=""
router.get('/', (req, res) => {
   //console.log("reached the pa")
   mturk_id= req.query.mturkid
   res.render('pls')
});

router.post('/', (req, res) => {
   console.log("reached the page");
   res.redirect(`/consentform?mturkid=${mturk_id}`)
   //res.send(req.body)
   //res.redirect("https://github.com/pugjs/pug/issues/1355")
   //res.redirect('/welcome');
});

module.exports = router;