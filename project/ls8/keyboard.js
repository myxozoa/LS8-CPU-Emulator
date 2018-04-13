const keyPressedAddress = 0xf4;
const asciiReturn = 10;
const asciiSpace = 32;
const asciiBackspace = 8;
const keypress = require('keypress');
keypress(process.stdin);
class Keyboard {
    constructor(cpu) {
        this.cpu = cpu;
        this.keyhandler = null;
        cpu.addPeripheral(this);

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

        process.stdin.on('keypress', (ch, key) => {
            if(key) {
                if (key.ctrl && key.name == 'c') {
                    this.cpu.stopClock();
                }
                switch (key.name) {
                    case 'escape':
                        this.cpu.stopClock();
                        break;
                    case 'return':
                        this.cpu.poke(keyPressedAddress, asciiReturn);
                        break;
                    case 'space':
                        this.cpu.poke(keyPressedAddress, asciiSpace);
                        break;
                    case 'backspace':
                        this.cpu.poke(keyPressedAddress, asciiBackspace);
                        break;
                    default:
                        this.cpu.poke(keyPressedAddress, key.name.charCodeAt(0));
                }
            } else if(ch) {
                this.cpu.poke(keyPressedAddress, ch.charCodeAt(0));
            }

            this.cpu.raiseInterrupt(1);
        });
    }
}

module.exports = Keyboard;
