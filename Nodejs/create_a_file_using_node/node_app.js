//Declaration of fs module for fs variable ( fs stand for file module )
const fs = require('fs')

// This is to create a new notepad file using node js and to write some text in that notepad 
fs.writeFileSync('notes.txt','This File was created by Node.js!')

// This is to append the text in existing notepad file  
fs.appendFileSync('notes.txt','  The code writen by JEEVAN.M :)')