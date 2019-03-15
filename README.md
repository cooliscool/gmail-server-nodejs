## Gmail Server to send Mails from your web-app !
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

## Dependencies

will be updated soon. I'll try to release binaries. 

## Some possible errors and how to get around them

### undefined xxx
this is about a missing node js dependency

solution : 
1. perform a quick googling for finding what package xxx belongs to
2. go to the project root folder 
3. run "npm install correspondingPackage"

### port already in use

change port in index.js

## What's Cool
1. Use this to monitor various processes in your system, send the details to your Gmail.
2. No need for getting a paid E-mail Iaas vendor like Send-Grid. Frugal! 

## Why this project sucks.
I don't know. Help me out if you find something.
