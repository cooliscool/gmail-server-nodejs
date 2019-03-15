## gmail-server-nodejs
A Gmail API based e-mail sending server using nodeJS and express. 

## How to get this running 
1. download credentials.json from Gmail API Developer Console
2. run the server, you'll be redirected to a login screen on browser, follow the steps, resulting in generation of token.json in root folder.
3. now use the following API to send mails using your own Gmail account.

http://localhost:3001/sendmail?secret=checkforsecretinIndex&dest=sasebot@gmail.com&body=nothin2wry


API : 

/sendmail

Params : 
1. secret : the pre-shared secret saved in index.js
2. dest   : destination mail 
3. body   : email body
