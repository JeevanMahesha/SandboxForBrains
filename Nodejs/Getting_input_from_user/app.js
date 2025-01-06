/* 
1.yargs package is used for give command in command line
2. yargs parse is used to pass the argument for the function 
3. in yargs builder option is used to pass the argument values in the via command line 
4. storing the data in json formate in a json file 
*/
const yargs = require('yargs')

// customize the yargs version
yargs.version('9.0.0')

//Create Command
yargs.command({
    command : 'add',
    describe : 'Adding a note',
    builder : {
        title:{
            describe : 'Notes Title',
            demandOption : true,
            type : 'string'
        },
        body:{
            describe : 'Notes Body',
            demandOption :true,
            type : 'string'
        }
    },
    handler : function(argv){
       console.log('Title : ' + argv.title);
       console.log('Body : '+ argv.body);
       
    }
})

// Remove command
yargs.command({
    command : 'remove',
    describe : 'Removing the notes',
    handler : function(){
        console.log('Removing the note...........!');
        
    }
})

// read command
yargs.command({
    command : 'read',
    describe : 'Reading the notes',
    handler : function(){
        console.log('Reading the notes..........!');
        
    }
})

//list command
yargs.command({
    command : 'list',
    describe :'List the notes',
    handler : function(){
        console.log('Listing the notes..........!');
        
    }
})

yargs.parse()