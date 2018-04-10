const RAM = require('./ram');
const CPU = require('./cpu');
const fs = require('fs');


/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {

    // Hardcoded program to print the number 8 on the console

    // const program = [ // print8.ls8
    //     "10011001", // LDI R0,8  Store 8 into R0
    //     "00000000",
    //     "00001000",
    //     "01000011", // PRN R0    Print the value in R0
    //     "00000000",
    //     "00000001"  // HLT       Halt and quit
    // ];
    // const program = [
    //     "10101010",
    //     "00000101",
    //     "00000101",
    //     "00000001",
    // ];
    fs.readFile(process.argv[2], 'utf-8', (err, data) => {
        if(err) throw new Error(err);

        const file = data.split('\n');
        for (let i = 0; i < file.length; i++) {
            const comment = file[i].indexOf('#');
            if(comment !== -1) {
                file[i] = file[i].substr(0, comment);
            }
            file[i] = file[i].trim();
            cpu.poke(i, parseInt(file[i], 2));
        }
    });

    // Load the program into the CPU's memory a byte at a time

}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu);

cpu.startClock();