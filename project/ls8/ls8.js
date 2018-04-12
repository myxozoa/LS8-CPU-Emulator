const RAM = require('./ram');
const CPU = require('./cpu');
const Keyboard = require('./keyboard');
const fs = require('fs');


/**
 * Load an LS8 program into memory
 *
 *
 */
function loadMemory() {
    if(!process.argv[2]) {
        console.error('Please supply a program to run \n i.e. `node ls8 print8.ls8`');
        process.exit(0);
    } else {
        const readLine = require('readline').createInterface({
            input: fs.createReadStream(`./${process.argv[2]}`, 'utf8'),
          });

          let instructionCount = 0;

          readLine.on('line', (line) => {
            let instruction = line.split('#')[0].trim();
            if (instruction.trim().length != 0) {
              cpu.poke(instructionCount, parseInt(instruction, 2));
              instructionCount++;
            }
          });
          readLine.on('close', () => {
            cpu.startClock();
            readLine.close();
          });
        // fs.readFileSync(process.argv[2], 'utf-8', (err, data) => {
        //     if(err) throw new Error(err);
        //     console.log('why is this breaking now');

        //     const file = data.split('\n');
        //     console.log('testing', file);
        //     for (let i = 0; i < file.length; i++) {
        //         const comment = file[i].indexOf('#');
        //         if(comment !== -1) {
        //             file[i] = file[i].substr(0, comment);
        //         }
        //         file[i] = file[i].trim();
        //         if(file[i] !== '') {
        //             console.log(file[i]);
        //             cpu.poke(i, parseInt(file[i], 2));
        //         }
        //     }
        // });
    }

}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);
let keyboard = new Keyboard(cpu);


loadMemory(cpu);

// cpu.startClock();