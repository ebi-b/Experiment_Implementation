const express = require('express');
const router = express.Router();
let mturk_id=""

router.get('/', (req, res) => {
    res.render('startexperiment');
    req.session.mturk_id = req.query.mturkid;
})


router.post('/', (req, res) => {

    console.log(req.body.butt)
    let repeated=true;
    if(req.body.butt =='1')
    res.redirect(`/tutorial1?mturkid=${req.session.mturk_id}&repeated=${repeated}`)
    if(req.body.butt =='2')
    res.redirect(`/tutorial2?mturkid=${req.session.mturk_id}&repeated=${repeated}`)
    if(req.body.butt =='3')
    res.redirect(`/baseline?mturkid=${req.session.mturk_id}&repeated=${repeated}`)
 });

module.exports = router;