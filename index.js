// secret code for the API access
const secret = 'sendMeTheMailBitch34asjkdkhkaj';
// sender's gmail ID 
const senderMail = 'xxx@gmail.com';
// express server port
const port = 3001


const express = require('express')
const app = express()
var gmail = require('./gmailapi.js');

var L = console.log;
var totalMails = 0;



app.get('/sendmail', (req, res) => {

	if(!req.query || !req.query.dest || !req.query.secret || !req.query.body) return res.send("invalid API");
	
	if(req.query.secret == secret){

		//TODO email sanity checks
		//TODO all input sanity checks

		gmail.funcs.send(req.query.dest , senderMail , req.query.body , (err, rs)=>{
			if(err) {
				return res.send(err);
			}
			else{
				totalMails += 1;
				L('Total mails sent : ' + totalMails);
				return res.send(rs);
			}
		});
		return;
		
	}	
	else{
		return res.send("go away!");	
	}
	

})

app.listen(port, () => console.log(`Gmail Server listening on port ${port}!`))
