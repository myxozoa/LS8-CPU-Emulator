const ctx = require('axel');

class Graphics {
  constructor(cpu) {
    this.cpu = cpu;
    this.start();
    // ctx.fg(255, 255, 255);
    // ctx.bg(0, 0, 0);

    this.xCount = 0;
    this.yCount = 1;

    this.fixedX = 0;
    this.fixedY = 0;
  }

  stop() {
    ctx.clear();
    ctx.cursor.on();
    ctx.cursor.restore();
  }
  start() {
    ctx.clear();
    ctx.cursor.off();

    // this.rawText(15,10, ctx.cols);
    // this.rawText(20,10, ctx.rows);
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
  rawText(x, y, char) {
    this.xCount++;
    // console.log('char', char);
    if(char === 10) {
      this.xCount = 0;
      this.yCount++;
    } else {
      ctx.text(x, y, char.toString());
    }
  }
  clear() {
    ctx.clear();
  }
  drawSprt(x, y) {
    ctx.brush = ' ';
    ctx.cursor.reset();
    ctx.point(this.fixedX, this.fixedY);
    this.fixedX = x % ctx.cols;
    this.fixedY = y % ctx.rows;
    ctx.brush = '╔';
    ctx.point(this.fixedX, this.fixedY);
  }
  drawBlc(x, y) {
    // ctx.brush = ' ';
    // ctx.cursor.reset();
    // ctx.point(this.fixedX, this.fixedY);
    // this.fixedX = x % ctx.cols;
    // this.fixedY = y % ctx.rows;
    ctx.brush = '▀';
    ctx.point(x, y);
  }

}

module.exports = Graphics;