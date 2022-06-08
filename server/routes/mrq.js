const express = require('express');
const participant = require('../models/participant');
const router = express.Router();
let mturk_id = ""
let nbackn_difficulty_level = 0;
const ParticipantModel = require('../models/participant')
let sequence_type = 0
let progress = 0



/************* Progress Sequence Block *************/
const E_n = 1
const H_n = 3
const E_s = 0
const H_s = 0
const seq_prog = [
    [E_n, E_s, 1, 2, H_n, E_s, 1, 2],
    [E_n, E_s, 2, 1, H_n, E_s, 2, 1],
    [H_n, E_s, 1, 2, E_n, E_s, 1, 2],
    [H_n, E_s, 2, 1, E_n, E_s, 2, 1],
    [E_n, H_s, 1, 2, H_n, H_s, 1, 2],
    [E_n, H_s, 2, 1, H_n, H_s, 2, 1],
    [H_n, H_s, 1, 2, E_n, H_s, 1, 2],
    [H_n, H_s, 2, 1, E_n, H_s, 2, 1]
];
/*************---------------------- *************/



router.get('/', async (req, res) => {

    // res.send(JSON.stringify({n:5}))
    mturk_id = req.query.mturkid;
    //send N (difficulty level) to the client
    if (!mturk_id) {

        return res.redirect('/welcome');
    }
    else {

        try {
            //     /* Read from the DataBase */
            const participant = await ParticipantModel.find({ mturk_id: mturk_id });
            await participant
            if (!participant)
                return res.redirect('/welcome');
            else {
                console.log(participant)
                console.log(typeof (participant))
                sequence_type = participant[0].sequence_type
                progress = participant[0].progress
                console.log(`seq is ${sequence_type} and progress is ${progress}`)
                if (progress <= 4)
                    participant[0].t_mrq_1_started = Date.now();
                else
                    participant[0].t_mrq_2_started = Date.now();
                await participant[0].save();
                res.render('mrq')



            }
        } catch (error) {
            console.log(error)
        }
    }

});



router.post('/', async (req, res) => {

    //console.log("in this router")
    // console.log("aep - "+req.body.aep)
    // console.log("alp - "+req.body.alp)
    // console.log("ffp - "+req.body.ffp)
    // console.log("fmp - "+req.body.fmp)
    // console.log("mp - "+req.body.mp)
    // console.log("stmp - "+req.body.stmp)
    // console.log("sap - "+req.body.sap)
    // console.log("scatp - "+req.body.scatp)
    // console.log("sconp - "+req.body.sconp)
    // console.log("sep - "+req.body.sep)
    // console.log("spp - "+req.body.spp)
    // console.log("sqp - "+req.body.sqp)
    // console.log("tfp - "+req.body.tfp)
    // console.log("vlp - "+req.body.vlp)
    // console.log("vpp - "+req.body.vpp)
    // console.log("vtp - "+req.body.vtp)
    // console.log("vp - "+req.body.vp)
    let mrq_arr = [
        req.body.aep,
        req.body.alp,
        req.body.ffp,
        req.body.fmp,
        req.body.mp,
        req.body.stmp,
        req.body.sap,
        req.body.scatp,
        req.body.sconp,
        req.body.sep,
        req.body.spp,
        req.body.sqp,
        req.body.tfp,
        req.body.vlp,
        req.body.vpp,
        req.body.vtp,
        req.body.vp
    ]

    try {
        //     /* Read from the DataBase */

        let tmp = await ParticipantModel.findOne({ mturk_id: mturk_id });
        if (!tmp) {
            console.log("invalid participant in mrq")
        } else {
            if (tmp.progress <= 4) {
                tmp.mrq_1 = JSON.stringify(mrq_arr)
                tmp.progress = tmp.progress + 1
                tmp.t_mrq_1_ended = Date.now();

                await tmp.save()
                if (tmp.progress == 4)
                    res.redirect(`/startplay?mturkid=${mturk_id}`)
                else if (tmp.progress == 3)
                    res.redirect(`/nasatlx?mturkid=${mturk_id}`)
            }
            else if ((tmp.progress > 4)) {
                tmp.progress = tmp.progress + 1
                tmp.mrq_2 = JSON.stringify(mrq_arr)

                tmp.t_mrq_2_ended = Date.now();
                await tmp.save()
                if (tmp.progress == 7)
                    res.redirect(`/nasatlx?mturkid=${mturk_id}`)
                else if (tmp.progress == 8)
                    res.redirect(`/completed?mturkid=${mturk_id}`)
            }
        }

    }


    catch (error) {
        console.log("Error in Updating Progress:  " + error)
    }

})


module.exports = router;


/*

const seq_prog = [
[E, E, 1, 2, H, E, 1, 2],
[E, E, 2, 1, H, E, 2, 1], 
[H, E, 1, 2, E, E, 1, 2],
[H, E, 2, 1, E, E, 2, 1],
[E, H, 1, 2, H, H, 1, 2],
[E, H, 2, 1, H, H, 2, 1],
[H, H, 1, 2, E, H, 1, 2],
[H, H, 2, 1, E, H, 2, 1]
  ];
_________________________________________________________________
seq_number | 1.n1 | 2.s | 3.q1| 4.q2|5.n2 | 6.s |7.q1 |8.q2 |
_________________________________________________________________
1          |  E   | E   |  1  |  2  |  H  |  E  |  1  |  2  |
2          |  E   | E   |  2  |  1  |  H  |  E  |  2  |  1  |
3          |  H   | E   |  1  |  2  |  E  |  E  |  1  |  2  |
4          |  H   | E   |  2  |  1  |  E  |  E  |  2  |  1  |
5          |  E   | H   |  1  |  2  |  H  |  H  |  1  |  2  |
6          |  E   | H   |  2  |  1  |  H  |  H  |  2  |  1  |
7          |  H   | H   |  1  |  2  |  E  |  H  |  1  |  2  |
8          |  H   | H   |  2  |  1  |  E  |  H  |  2  |  1  |
__________________________________________________________________
------------------------------------------------------------------

*/