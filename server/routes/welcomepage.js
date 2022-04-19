/* ----------------Experiment Sequences---------------------------
N : first nbackn difficulty (H/E)
Q : first Questionaire (1: NASA-TLX and 2: MRQ)
S : SakeDifficulty(H/E)
_________________________________________________________________
seq_number |  n1  |   s | q1  | q2  |  n2 |  s  |  q1 | q2  |
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
------------------------------------------------------------------*/

const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
let alert = require('alert');
const User = require("../models/mturkid");
const mturkidModel = require('../models/mturkid');
const webPush = require('web-push');
const { append } = require('express/lib/response');
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



        if (!found)
            res.render('welcome_page - Invalid Response');
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
                        used_before: false
                    });
                    // res.redirect('http://127.0.0.1:5500/screens/pls.html')
                    //res.render('pls')
                    //console.log(found.mturk_id)
                    res.redirect(`/pls?mturkid=${found.mturk_id}`)
                    /* Make the new object and save it in d
                    const newParticipant = new mturkidModel
                    newParticipant.mturk_id = req.body.mturkid
                    newParticipant.used_before=true*/

                } catch (error) {
                    // res.status(500).redirect('http://127.0.0.1:5500/screens/pls.html');
                    //res.status(500).render('pls')
                    //console.log(found.mturk_id)
                    res.status(500).redirect(`/pls?mturkid=${found.mturk_id}`)
                }



            }

        }
    }
});

module.exports = router;