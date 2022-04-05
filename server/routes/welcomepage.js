const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
let alert = require('alert');
const User = require("../models/mturkid");
const mturkidModel = require('../models/mturkid');
//const listOfMturkIds = [{ id: "jes5", used: false}, { id: "jes6", used: false }, { id: "jes7", used: false }]


router.post('/', async (req, res) => {

    if (!req.body.mturkid) {
        return res.status(400).send({ error: "You must insert your mturk id" });
    }
    else {


        /* Read from the DataBase */
        const validMturkIDs = await mturkidModel.find({});
        //console.log(validMturkIDs)
        var found = validMturkIDs.find(item => item.mturk_id == req.body.mturkid)
        console.log("Found is this one:  " + found + "---")



        if (!found)
            res.send("Insert a valid Mturk id")
        else {
            if (found.used_before) {
                alert("Used ")
                res.status(204).send()
            }

            else {
                /* update the DB*/
                try {
                    await mturkidModel.updateOne({ mturk_id: found.mturk_id }, {
                        used_before: true
                    });
                    res.redirect('http://127.0.0.1:5500/screens/pls.html')

                    /* Make the new object and save it in db
                    const newParticipant = new mturkidModel
                    newParticipant.mturk_id = req.body.mturkid
                    newParticipant.used_before=true*/

                } catch (error) {
                    res.status(500).redirect('http://127.0.0.1:5500/screens/pls.html');
                }



            }

        }
    }
});

module.exports = router;