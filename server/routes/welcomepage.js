/* ----------------Experiment Sequences---------------------------
N : first nbackn difficulty (H/E)
Q : first Questionaire (1: NASA-TLX and 2: MRQ)
S : SakeDifficulty(H/E)
_________________________________________________________________________
seq_number/Progress | 1.n1 | 2.s | 3.q1| 4.q2|5.n2 | 6.s |7.q1 |8.q2 |
_________________________________________________________________________
         1          |  E   | E   |  1  |  2  |  H  |  E  |  1  |  2  |
         2          |  E   | E   |  2  |  1  |  H  |  E  |  2  |  1  |
         3          |  H   | E   |  1  |  2  |  E  |  E  |  1  |  2  |
         4          |  H   | E   |  2  |  1  |  E  |  E  |  2  |  1  |
         5          |  E   | H   |  1  |  2  |  H  |  H  |  1  |  2  |
         6          |  E   | H   |  2  |  1  |  H  |  H  |  2  |  1  |
         7          |  H   | H   |  1  |  2  |  E  |  H  |  1  |  2  |
         8          |  H   | H   |  2  |  1  |  E  |  H  |  2  |  1  |
________________________________________________________________________
------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
// const bcrypt = require("bcrypt");
// let alert = require('alert');
const ParticipantModel = require("../models/participant");
const mturkidModel = require('../models/mturkid');
const webPush = require('web-push');
const { append } = require('express/lib/response');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
// let crypto = require('crypto');
//const listOfMturkIds = [{ id: "jes5", used: false}, { id: "jes6", used: false }, { id: "jes7", used: false }]

router.get('/', (req, res) => {
    res.render('welcome_page')
   // console.log("abas is masoomi"+participant_mturk_id)
})

router.post('/', async (req, res) => {

    if (!req.body.mturkid) {
        //return res.status(400).send({ error: "You must insert your mturk id" });

        return res.render('welcome_page - Invalid Response');
    }
    else {


        /* Read from the DataBase */
        const validMturkIDs = await mturkidModel.find({});
        //console.log(validMturkIDs)
        var found = validMturkIDs.find(item => item.mturk_id == req.body.mturkid)
        //console.log("Found is this one:  " + found + "---")



        if (!found){
            //res.render('welcome_page - Invalid Response');
            const newID = new mturkidModel;  

            newID.mturk_id=req.body.mturkid
            newID.used_before=true

            await newID.save((err, doc) => {
                if (!err)
                    console.log('success'+`ID added successfully! with id ${req.body.mturk_id}`);
                else
                    console.log('Error during record insertion : ' + err);
          });
   
          try {
            // await mturkidModel.updateOne({ mturk_id: found.mturk_id }, {
            //     used_before: true// CHANGE THIS TO TRUE WHEN START RUNNING THE EXPERIMENT.
            // });
            // res.redirect('http://127.0.0.1:5500/screens/pls.html')
            //res.render('pls')
            //console.log(found.mturk_id)

            /* Make the new object and save it in db */
            const newParticipant = new ParticipantModel;
            const rand_seq = getRandomInt();

            newParticipant.mturk_id = req.body.mturkid;
            newParticipant.sequence_type = rand_seq;
            newParticipant.progress = 0;
            newParticipant.nbackn_1 = [];
            newParticipant.nbackn_2 = [];
            newParticipant.sak_1 = [];
            newParticipant.sak_2 = [];
            newParticipant.nasa_1_r = [];
            newParticipant.nasa_2_r = [];
            newParticipant.nasa_1_w = [];
            newParticipant.nasa_2_w = [];
            newParticipant.mrq_1 = [];
            newParticipant.mrq_2 = [];

            await newParticipant.save((err, doc) => {
                if (!err)
                    console.log('success'+`User added successfully! with seq number ${rand_seq}`);
                else
                    console.log('Error during record insertion : ' + err);
          });

            res.redirect(`/pls?mturkid=${req.body.mturkid}`)
            

        } catch (error) {
            console.log('Error during record update : '+error)
            // res.status(500).redirect('http://127.0.0.1:5500/screens/pls.html');
            //res.status(500).render('pls')
            //console.log(found.mturk_id)
            res.status(500).redirect(`/pls?mturkid=${found.mturk_id}`)
        }
        
        
        
        
        }
        else {
            if (found.used_before) {
                //alert("Used ")
                res.render('welcome_page - Invalid Response');
                //res.status(204).send()
            }

            else {
                /* update the DB*/
                try {
                    await mturkidModel.updateOne({ mturk_id: found.mturk_id }, {
                        used_before: true// CHANGE THIS TO TRUE WHEN START RUNNING THE EXPERIMENT.
                    });
                    // res.redirect('http://127.0.0.1:5500/screens/pls.html')
                    //res.render('pls')
                    //console.log(found.mturk_id)

                    /* Make the new object and save it in db */
                    const newParticipant = new ParticipantModel;
                    const rand_seq = getRandomInt();

                    newParticipant.mturk_id = req.body.mturkid;
                    newParticipant.sequence_type = rand_seq;
                    newParticipant.progress = 0;
                    newParticipant.nbackn_1 = [];
                    newParticipant.nbackn_2 = [];
                    newParticipant.sak_1 = [];
                    newParticipant.sak_2 = [];
                    newParticipant.nasa_1_r = [];
                    newParticipant.nasa_2_r = [];
                    newParticipant.nasa_1_w = [];
                    newParticipant.nasa_2_w = [];
                    newParticipant.mrq_1 = [];
                    newParticipant.mrq_2 = [];

                    await newParticipant.save((err, doc) => {
                        if (!err)
                            console.log('success'+`User added successfully! with seq number ${rand_seq}`);
                        else
                            console.log('Error during record insertion : ' + err);
                  });

                    res.redirect(`/pls?mturkid=${found.mturk_id}`)
                    

                } catch (error) {
                    console.log('Error during record update : '+error)
                    // res.status(500).redirect('http://127.0.0.1:5500/screens/pls.html');
                    //res.status(500).render('pls')
                    //console.log(found.mturk_id)
                    res.status(500).redirect(`/pls?mturkid=${found.mturk_id}`)
                }



            }

        }
    }
});


function getRandomInt() {
    // let cs= (x,y)=>x+(y-x+1)*crypto.getRandomValues(new Uint32Array(1))[0]/2**32|0
let min=1
let max=8
    // return cs(1,8);
    return Math.floor(
        Math.random() * (max - min + 1) + min)
  }
module.exports = router;