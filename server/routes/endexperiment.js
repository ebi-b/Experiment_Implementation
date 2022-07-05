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
const { invalid } = require('joi');
// let crypto = require('crypto');
//const listOfMturkIds = [{ id: "jes5", used: false}, { id: "jes6", used: false }, { id: "jes7", used: false }]

router.get('/', async (req, res) => {
    let completed = true;
    if (!req.query.mturkid) {
        console.log("response is empty")
        return res.render('welcome_page - Invalid Response');
    }
    else {
        /* Read from the DataBase */
        const validMturkIDs = await mturkidModel.find({});
        //console.log(validMturkIDs)
        var foundID = validMturkIDs.find(item => item.mturk_id == req.query.mturkid)
        //console.log("Found is this one:  " + found + "---")

        const validparticipants = await ParticipantModel.find({});
        //console.log(validMturkIDs)
        var foundparticipant = validparticipants.find(item => item.mturk_id == req.query.mturkid)

        /* Check Progress Here */
        if (foundparticipant.progress != 8)
            completed = false


        /*check another parameter which says they do not come from a trap */

        if (completed) {
            res.render('completion-valid')
            foundID.completed = true
            await foundID.save()

        }
        else {
            res.render('completion-invalid')
        }

    }

})


module.exports = router;