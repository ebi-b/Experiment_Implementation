const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose');
const cluster = 'cluster0.xyml4'
const username = 'ebrahimbabaei92'
const password = 'HTbMzZzU04rEw7rs'



mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority)`)
  .then(() => console.log("Connected to DB"))
  .catch (console.error);


// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors())


//Routes
const welcomePageRoute= require('./routes/welcomepage');
app.use('/welcome',welcomePageRoute)

const plsPageRoute = require('./routes/plspage');
app.use('/pls', plsPageRoute)






const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
})


