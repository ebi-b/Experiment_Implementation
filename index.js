const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose');
const cluster = 'cluster0.xyml4'
const username = 'ebrahimbabaei92'
const password = 'HTbMzZzU04rEw7rs'
var path = require ('path');
const { string } = require('joi');
const mongooseUri= process.env.MONGODB_URI||`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`



// mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
//   .then(() => console.log("Connected to DB"))
//   .catch(console.error);

  mongoose.connect(mongooseUri)
  .then(() => console.log("Connected to DB"))
  .catch(console.error);


// We are using our packages here
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cors())
//var temp = express.static(__dirname + '../public')
//console.log(temp.toString())
app.use(express.static('public'));

//app.use(express.static('public'))

//setting the view folder
 dir = __dirname.split('\\')
 let participant_mturk_id = "Temporary"
//console.log(dir)
// var s = "";
// for (i = 0; i < dir.length - 1; i++)
//   s = s + dir[i] + '/'
// path_screen = s + 'screens/'
const viewsPath = path.join(__dirname, './public/screens')
app.set('views', viewsPath)
//app.set('view engine', 'pug')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Routes
const welcomePageRoute = require('./server/routes/welcomepage');
app.use('/welcome', welcomePageRoute)
app.use('/',welcomePageRoute)

const plsPageRoute = require('./server/routes/plspage');
app.use('/pls', plsPageRoute)

const cfPageRoute = require('./server/routes/consentform');
app.use('/consentform', cfPageRoute)

const introPageRoute = require('./server/routes/intro');
app.use('/intro', introPageRoute)

const baselinePageRoute = require('./server/routes/baseline');

app.use('/baseline', baselinePageRoute)

const startplayPageRoute = require('./server/routes/startplay');
app.use('/startplay', startplayPageRoute)

const sakPageRoute = require('./server/routes/sakexperiment');
app.use('/sak', sakPageRoute)

const mrqPageRoute = require('./server/routes/mrq');
app.use('/mrq', mrqPageRoute)

const nasatlxPageRoute = require('./server/routes/nasatlx.js');
app.use('/nasatlx',nasatlxPageRoute)

const tutorial1PageRoute = require('./server/routes/tutorial1.js');
app.use('/tutorial1',tutorial1PageRoute)

const tutorial2PageRoute = require('./server/routes/tutorial2.js');
app.use('/tutorial2',tutorial2PageRoute)

const startExperimentPageRoute = require('./server/routes/startexperiment.js');
app.use('/startexperiment',startExperimentPageRoute)





const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
})


