/* 
process.argv is an array which gets the input from the user using commend line and printes it

process.argv[2] in this the first two index will having the node path and file path so always start 
with third index value in the array 

*/

const command = process.argv[2]
 if (command === 'add'){
    console.log('Adding Notes.......');
 } else if( command === 'remove'){
     console.log('Removing Notes.......');
 }else{
     console.log('Wrong Input');
 }
