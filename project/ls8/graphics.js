const ctx = require('axel');

class Graphics {
  constructor(cpu) {
    this.cpu = cpu;
    ctx.brush = '█';
    this.start();

    this.xCount = 0;
    this.yCount = 1;
  }

  stop() {
    ctx.clear();
  }
  start() {
    ctx.clear();
    ctx.cursor.restore();
  }
  text(char) {
    this.xCount++;
    // console.log('char', char);
    if(char === 10) {
      this.xCount = 0;
      this.yCount++;
    } else {
      ctx.text(this.xCount, this.yCount, String.fromCharCode(char));
    }
  }
  clear() {
    ctx.clear();
  }
}

module.exports = Graphics;