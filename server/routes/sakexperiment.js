const express = require('express');
const participant = require('../models/participant');
const router = express.Router();
let mturk_id = ""
const ParticipantModel = require('../models/participant')
let sequence_type = 0
let progress = 0
let isTrial = true


/************* Progress Sequence Block *************/
const E_n = 1
const H_n = 3
const E_s = 500
const H_s = 1000
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




// router.get('/', async (req, res) => {
//     res.render('SAKExperiment')
//     mturk_id = req.query.mturkid

// });


router.get('/', async (req, res) => {
    isTrial = false
    // res.send(JSON.stringify({n:5}))
    mturk_id = req.query.mturkid;
    //send N (difficulty level) to the client
    if (!mturk_id) {

        return res.redirect('/welcome');
    }
    else {

        try {
            //     /* Read from the DataBase */
            const participant = await ParticipantModel.findOne({ mturk_id: mturk_id });
            await participant
            if (!participant)
                return res.redirect('/welcome');
            else {
                console.log("Participant i begining of SAK: " + participant)
                // console.log(typeof (participant))
                sequence_type = participant.sequence_type
                progress = participant.progress
                if (progress == 1)
                    participant.t_sak_1_started = Date.now();
                else
                    participant.t_sak_2_started = Date.now();
                participant.save();
                //console.log(`seq is ${sequence_type} and progress is ${progress}`)
                res.render('SAKExperiment')



            }
        } catch (error) {
            console.log("Error is here: " + error)
        }
    }

});


//     try {
//         //     /* Read from the DataBase */
//         let p_temp = await ParticipantModel.findOne({ mturk_id: mturk_id });
//         p_temp.progress = p_temp.progress+1;
//         await p_temp.save();
//         //   =await ParticipantModel.findOne({ mturk_id: mturk_id })


//         console.log(p_temp.sequence_type)

//         console.log(p_temp.progress)

//     }
//     catch (error) {
//         console.log("Error in Updating Progress:  " + error)
//     }

router.post('/', async (req, res) => {
    if (isTrial) {
        return res.redirect(`/startexperiment?mturkid=${mturk_id}`)

    }

    else {
        try {
            console.log("ACTS:" + req.body.actions)
            console.log("T: " + req.body.timestamps)
            //     /* Read from the DataBase */
            let p_temp = await ParticipantModel.findOne({ mturk_id: mturk_id });
            if (progress == 1) {
                p_temp.t_sak_1_ended = Date.now();
                p_temp.sak_1_actions = req.body.actions
                p_temp.sak_1_actions_t = req.body.timestamps



            }
            else {
                p_temp.t_sak_2_ended = Date.now();
                p_temp.sak_2_actions = req.body.actions
                p_temp.sak_2_actions_t = req.body.timestamps

            }
            p_temp.progress = p_temp.progress + 1;
            await p_temp.save();
            let prog = p_temp.progress
            let seq_t = p_temp.sequence_type
            prog = prog
            seq_t = seq_t - 1
            if (prog <= 7) {
                if (seq_prog[seq_t][prog] == 1)
                    return res.redirect(`/nasatlx?mturkid=${mturk_id}`)
                else if (seq_prog[seq_t][prog] == 2)
                    return res.redirect(`/mrq?mturkid=${mturk_id}`)
                else {
                    console.log("Invalid Progress Number")
                }
            }

            // if (seq_prog[p_temp.sequence_type][p_temp.progress + 1] == 1)
            //     res.redirect(`/mrq?mturkid=${mturk_id}`)
            // else if (seq_prog[p_temp.sequence_type][p_temp.progress + 1] == 2)
            //     res.redirect(`/mrq?mturkid=${mturk_id}`)

        }
        catch (error) {
            console.log("Error in Updating Progress:  Here " + error)
        }
    }
})


router.get('/trial', async (req, res) => {
    isTrial = true
    // res.send(JSON.stringify({n:5}))
    mturk_id = req.query.mturkid;
    repeated = req.query.repeated
    //send N (difficulty level) to the client
    if (!repeated) {
        repeated = false
    }
    //send N (difficulty level) to the client
    if (!mturk_id) {

        return res.redirect('/welcome');
    }
    else {

        try {
            //     /* Read from the DataBase */
            // const participant = await ParticipantModel.findOne({ mturk_id: mturk_id });
            // await participant
            // if (!participant)
            //     return res.redirect('/welcome');
            // else {
            //     console.log("Participant i begining of SAK: "+participant)
            //     // console.log(typeof (participant))
            //     sequence_type = participant.sequence_type
            //     progress = participant.progress
            //     if (progress == 1)
            //         participant.t_sak_1_started = Date.now();
            //     else
            //         participant.t_sak_2_started = Date.now();
            //     participant.save();
            //     //console.log(`seq is ${sequence_type} and progress is ${progress}`)
            res.render('SAKExperiment-trial')




        } catch (error) {
            console.log("Error is here: " + error)
        }
    }

});

router.get('/diflevel', (req, res) => {
    if (isTrial)
        res.send(JSON.stringify({ n: E_s }));
    else
    {
        if(sequence_type<=3)
            res.send(JSON.stringify({ n: E_s }));
        else if(sequence_type>3)
            res.send(JSON.stringify({ n: H_s }));
    }

})
module.exports = router;


