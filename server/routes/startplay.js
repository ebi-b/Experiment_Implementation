const express = require('express');
const router = express.Router();
let mturk_id = ""
const ParticipantModel = require('../models/participant')
let sequence_type = 0
let progress = 0
let isTrial = true
let repeated = false

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
    req.session.isTrial = false
    // res.send(JSON.stringify({n:5}))
    req.session.mturk_id = req.query.mturkid;
    //send N (difficulty level) to the client
    if (!req.session.mturk_id) {

        return res.redirect('/welcome');
    }
    else {

        try {
            //     /* Read from the DataBase */
            const participant = await ParticipantModel.findOne({ mturk_id: req.session.mturk_id });
            await participant
            if (!participant)
                return res.redirect('/welcome');
            else {
                console.log(participant)
                console.log(typeof (participant))
                req.session.sequence_type = participant.sequence_type
                req.session.progress = participant.progress
                if (req.session.progress == 0)
                    participant.t_nbackn_1_started = Date.now();
                else
                    participant.t_nbackn_2_started = Date.now();
                participant.save();
                console.log(`seq is ${req.session.sequence_type} and progress is ${req.session.progress}`)
                res.render('startplay')



            }
        } catch (error) {
            console.log("Error is here: " + error)
        }
    }

});

router.get('/diflevel', (req, res) => {
    if (req.session.isTrial)
        res.send(JSON.stringify({ n: 2 }));
    else
        res.send(JSON.stringify({ n: seq_prog[req.session.sequence_type - 1][req.session.progress] }));


})


router.post('/nbacknstats', async (req, res) => {
    /* creating nbackn stat array
    [n, stack_lenght, v_hits, v_mis, v_wrong, l_hit, l_miss, l_wrong]
    */
    if (!req.session.isTrial) {
        let stat_array = [
            req.body.n,
            req.body.stack_lenght,
            req.body.v_hits,
            req.body.v_mis,
            req.body.v_wrong,
            req.body.l_hit,
            req.body.l_miss,
            req.body.l_wrong
        ]
        try {
            //     /* Read from the DataBase */

            let p;
            if (req.session.progress == 0) {
                p = await ParticipantModel.findOneAndUpdate({ mturk_id: req.session.mturk_id }, { nbackn_1: stat_array });
                p.progress = 1;
                p.t_nbackn_1_ended = Date.now();
                p.save();
            }
            else if (req.session.progress == 4) {
                p = await ParticipantModel.findOneAndUpdate({ mturk_id: req.session.mturk_id }, { nbackn_2: stat_array });
                p.t_nbackn_2_ended = Date.now();
                p.progress = 5;
                p.save();
            }
            return res.redirect(`/sak?mturkid=${req.session.mturk_id}`)
        }
        catch (error) {
            console.log("Error in Updating nbackn stats:  " + error)
        }
    }
    else {
        console.log("repeated is : " +typeof(req.session.repeated))
        if(req.session.repeated==true){
            console.log("HERE HAJI 1")
            return res.redirect(`/startexperiment?mturkid=${req.session.mturk_id}`)}
        else if(req.session.repeated==false) {
            console.log("HERE HAJI 2")
            return res.redirect(`/tutorial2?mturkid=${req.session.mturk_id}`)
        }
    }

}
);


router.post('/nbackntime', async (req, res) => {
    console.log("in nbackntime router")
    if (!req.session.isTrial) {
        try {
            // console.log(req.body)
            //     /* Read from the DataBase */
            // await ParticipantModel.findOneAndUpdate({ mturk_id: mturk_id }, { t_nbackn_1_started: Date.now()});
            let p;
            if (req.session.progress == 0) {
                p = await ParticipantModel.findOneAndUpdate({ mturk_id: req.session.mturk_id }, { t_nbackn_1_started: Date.now() });
                p.t_nbackn_1_ended = Date.now();
                p.save();
            }
            else if (req.session.progress == 5) {
                p = await ParticipantModel.findOneAndUpdate({ mturk_id: req.session.mturk_id }, { t_nbackn_2_started: Date.now() });
                p.t_nbackn_2_ended = Date.now();
                p.save();
                console.log(p)
            }

            // participant.t_nbackn_1_started = Date.now();
            // participant.save();
            res.send("succeed")
        }
        catch (error) {
            console.log("Error in Updating Progress:  " + error)
        }
    }
})


router.get('/trial', async (req, res) => {
    req.session.isTrial = true
    // res.send(JSON.stringify({n:5}))
    req.session.mturk_id = req.query.mturkid;
    //send N (difficulty level) to the client

    let repeated_tmp = req.query.repeated
    //send N (difficulty level) to the client
    if (typeof repeated_tmp === 'undefined') {
        req.session.repeated = false
    } else
    req.session.repeated = (repeated_tmp === 'true');
       

    if (!req.session.mturk_id) {

        return res.redirect('/welcome');
    }
    else {

        try {
            //     /* Read from the DataBase */
            const participant = await ParticipantModel.findOne({ mturk_id: req.session.mturk_id });
            await participant
            if (!participant)
                return res.redirect('/welcome');
            else {
                // console.log(participant)
                // console.log(typeof (participant))
                // sequence_type = participant.sequence_type
                // progress = participant.progress
                // if (progress == 0)
                //     participant.t_nbackn_1_started = Date.now();
                // else
                //     participant.t_nbackn_2_started = Date.now();
                // participant.save();
                // console.log(`seq is ${sequence_type} and progress is ${progress}`)
                res.render('startplay')



            }
        } catch (error) {
            console.log("Error is here: " + error)
        }
    }

});




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