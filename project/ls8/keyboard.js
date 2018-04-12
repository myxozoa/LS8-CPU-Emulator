const keyPressedAddress = 0xF4;
const ctrlC = '\u0003';

class Keyboard {
  constructor(cpu) {
    this.cpu = cpu;
    this.keyhandler = null;
    cpu.addPeripheral(this);

    this.start();
  }

  stop() {
    process.stdin.setRawMode(false);
    process.stdin.removeListener('data', this.keyhandler);
    process.stdin.end();
  }
  start() {
    process.stdin.setRawMode(true);
    process.stdin.setEncoding('utf-8');

    this.keyhandler = (key) => {
      if (key === ctrlC ) {
        this.cpu.stopClock();
      }
      this.cpu.poke(keyPressedAddress, key.charCodeAt(0));

      this.cpu.raiseInterrupt(1);
    };

    process.stdin.on('data', this.keyhandler);
  }
}

module.exports = Keyboard;