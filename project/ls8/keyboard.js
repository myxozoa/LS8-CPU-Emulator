const keyPressedAddress = 0xf4;
const asciiReturn = 10;
const asciiSpace = 32;
const asciiBackspace = 8;
const keypress = require('keypress');
const iohook = require('iohook');
// keypress(process.stdin);
class Keyboard {
    constructor(cpu) {
        this.cpu = cpu;
        cpu.addPeripheral(this);

        this.twoKey = false;
        this.heldKey = null;

        this.start();
    }

    stop() {
        process.stdin.setRawMode(false);
        process.stdin.end();
        process.exit();
    }
    start() {
        process.stdin.setRawMode(true);
        process.stdin.resume();

        iohook.on('keydown', event => {
            if(event.rawcode === 27) {
                this.cpu.stopClock();
            } else {
                if(this.heldKey !== null && this.heldKey !== event.rawcode) {
                    this.cpu.poke(keyPressedAddress, event.rawcode);
                    this.twoKey = true;
                } else {
                    this.cpu.poke(keyPressedAddress, event.rawcode);
                    this.heldKey = event.rawcode;
                }
            }
        });
        iohook.on('keyup', event => {
            if(this.twoKey) {
                this.cpu.poke(keyPressedAddress, this.heldKey);
                this.twoKey = false;
            } else if(this.heldKey === event.rawcode) {
                this.cpu.poke(keyPressedAddress, 0);
                this.heldKey = null;
            } else {
                this.cpu.poke(keyPressedAddress, 0);
            }
        });
        iohook.start();
    }
}

module.exports = Keyboard;
