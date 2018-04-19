/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
const NanoTimer = require('nanotimer');

const ADD = 0b10101000;
const ADDI = 0b10101111;
const AND = 0b10110011;
const CALL = 0b01001000;
const CALLI = 0b01001001;
const CMP = 0b10100000;
const CMPI = 0b10100001;
const CLR = 0b00000100;
const DEC = 0b01111001;
const DIV = 0b10101011;
const DRW = 0b10000110;
const DRWB = 0b10001110;
const HLT = 0b00000001;
const INC = 0b01111000;
const INT = 0b01001010;
const IRET = 0b00001011;
const JEQ = 0b01010001;
const JEQI = 0b01011111;
const JGT = 0b01010100;
const JGTI = 0b01010110;
const JLT = 0b01010011;
const JMP = 0b01010000;
const JMPI = 0b01010111;
const JNE = 0b01010010;
const LD = 0b10011000;
const LDI = 0b10011001;
const MOD = 0b10101100;
const MUL = 0b10101010;
const NOP = 0b00000000;
const NOT = 0b01110000;
const OR = 0b10110001;
const POP = 0b01001100;
const PRA = 0b01000010;
const PRN = 0b01000011;
const PUSH = 0b01001101;
const RET = 0b00001001;
const ST = 0b10011010;
const SUB = 0b10101001;
const SUBI = 0b10111001;
const XOR = 0b10110010;


const FL = 4;
const IM = 5;
const IS = 6;
const SP = 7;

const FLAG_EQ = 0;
const FLAG_GT = 1;
const FLAG_LT = 2;

const vecTableStart = 0xF8;
const parameterCountMask = 0b11000000;


const intMask = [
    (0x1 << 0), // timer
    (0x1 << 1), // keyboard
    (0x1 << 2), // reserved
    (0x1 << 3), // reserved
    (0x1 << 4), // reserved
    (0x1 << 5), // reserved
    (0x1 << 6), // reserved
    (0x1 << 7), // reserved
  ];

class CPU {
    /**
     * Initialize the CPU
     */
    constructor(ram, graphics) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        this.reg[SP] = 0xf4; // SP

        // Special-purpose registers
        this.reg.PC = 0; // Program Counter
        this.reg.FL = 0;
        this.reg.IR = 0;
        // this.reg.MAR = 0;
        // this.reg.MDR = 0;

        this.peripherals = [];

        this.graphics = graphics;
        this.addPeripheral(graphics);

        this.calling = false;
        this.interruptsEnabled = true;

        this.clockspeed = 1;
    }

    addPeripheral(per) {
        this.peripherals.push(per);
    }

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        // console.log('address: ', address);
        this.ram.write(address, value);
    }

    raiseInterrupt(n) {
        this.reg[IS] |= intMask[n];
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        // this.clock = setInterval(() => {
        //     this.tick();
        // }, this.clockspeed); // 1 ms delay == 1 KHz clock == 0.000001 GHz
        this.clock = new NanoTimer();
        this.interruptsTimer = new NanoTimer();

        this.clock.setInterval(() => {
            this.tick();
        }, '', '1m');

        this.interruptsTimer.setInterval(() => {
            this.raiseInterrupt(0);
        }, '', '166m');
    }

    setFlag(flag) {
        this.reg.FL = 0b1 << flag;
    }

    checkFlag(flag) {
        // console.log('checkflagtest: ', (this.reg[FL] & (0b1 << flag)) !== 0);
        return (this.reg.FL & (0b1 << flag)) !== 0;
    }

    /**
     * Stops the clock
     */
    stopClock() {
        // clearInterval(this.clock);
        // clearInterval(this.interruptTimer);
        this.interruptsTimer.clearInterval();
        this.clock.clearInterval();
        for(let per of this.peripherals) {
            per.stop();
        }
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        const valA = this.reg[regA];
        const valB = this.reg[regB];
        switch (op) {
            case 'ADD':
                this.reg[regA] = valA + valB;
                break;
            case 'ADDI':
                this.reg[regA] = valA + regB;
                break;
            case 'SUB':
                this.reg[regA] = valA - valB;
                break;
            case 'SUBI':
                this.reg[regA] = valA - regB;
                break;
            case 'MUL':
                this.reg[regA] = valA * valB;
                break;
            case 'DIV':
                if (valB === 0) {
                    console.error('Divide by zero error');
                    this.stopClock();
                } else {
                    this.reg[regA] = valA / valB;
                }
                break;
            case 'INC':
                this.reg[regA] += 1;
                break;
            case 'DEC':
                this.reg[regA] -= 1;
                break;
            case 'CMP':
                if (valA > valB) this.setFlag(FLAG_GT);
                if (valA < valB) this.setFlag(FLAG_LT);
                if (valA === valB) this.setFlag(FLAG_EQ);
                break;
            case 'CMPI':
                if (valA > regB) this.setFlag(FLAG_GT);
                if (valA < regB) this.setFlag(FLAG_LT);
                if (valA === regB) this.setFlag(FLAG_EQ);
                break;
            case 'MOD':
                if (valB === 0) {
                    console.error('Divide by zero error');
                    this.stopClock();
                } else {
                    this.reg[regA] = valA % valB;
                }
                break;
            case 'AND':
                this.reg[regA] = valA & valB;
                break;
            case 'NOT':
                this.reg[regA] = ~valA;
                break;
            case 'OR':
                this.reg[regA] = valA | valB;
                break;
            case 'XOR':
                this.reg[regA] = valA ^ valB;
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {

        const _push = itm => {
            this.alu('DEC', SP);
            this.ram.write(this.reg[SP], itm);
        };
        const _pop = () => {
            const res = this.ram.read(this.reg[SP]);
            this.alu('INC', SP);
            // console.log('POPPED: ', res);
            return res;
        };

        if (this.interruptsEnabled) {
            const maskedInts = this.reg[IS] & this.reg[IM];

            for (let i = 0; i < 8; i++) {
                if (((maskedInts >> i) & 0x01) === 1) {
                    this.interruptsEnabled = false;

                    this.reg[IS] &= ~intMask[i];
                    _push(this.reg.PC);
                    _push(this.reg.FL);
                    for(let r = 0; r <= 6; r++) {
                        _push(this.reg[r]);
                    }
                    const vec = this.ram.read(vecTableStart + i);
                    this.reg.PC = vec;
                    break;
                }
            }
        }
        this.reg.IR = this.ram.read(this.reg.PC);
        const nextInstruction = (this.reg.IR & parameterCountMask) >>> 6;
        // console.log('nextInstruction');

        let operandA = this.ram.read(this.reg.PC + 1);
        let operandB = this.ram.read(this.reg.PC + 2);

        // console.log('OP-A: ', operandA);
        // console.log('OP-B: ', operandB);
        // console.log('PC: ', this.reg.PC);
        // console.log('SP: ', this.reg[SP]);
        // console.log('RAM[0]: ', this.ram.mem[0]);
        // console.log('RAM[1]: ', this.ram.mem[1]);
        // console.log('RAM[2]: ', this.ram.mem[2]);
        // console.log('RAM[3]: ', this.ram.mem[3]);
        // console.log('RAM[4]: ', this.ram.mem[4]);
        // console.log('RAM[5]: ', this.ram.mem[5]);
        // console.log('RAM[F8]: ', this.ram.mem[0xF8]);
        // console.log('RAM[F4]: ', this.ram.mem[0xF4]);
        // console.log('RAM[F3]: ', this.ram.mem[0xF3]);
        // console.log('RAM[F2]: ', this.ram.mem[0xF2]);
        // console.log('RAM[F1]: ', this.ram.mem[0xF1]);
        // console.log('RAM[F0]: ', this.ram.mem[0xF0]);
        // console.log('REG: ', this.reg);
        // console.log('IR: ', this.reg.IR.toString(2));

        const handle_ADD = () => {
            this.alu('ADD', operandA, operandB);
        };
        const handle_ADDI = () => {
            this.alu('ADDI', operandA, operandB);
        };
        const handle_AND = () => {
            this.alu('AND', operandA, operandB);
        };
        const handle_CALL = () => {
            _push(this.reg.PC + nextInstruction);
            this.reg.PC = this.reg[operandA];
            this.calling = true;
        };
        const handle_CALLI = () => {
            _push(this.reg.PC + nextInstruction);
            this.reg.PC = operandA;
            this.calling = true;
        };
        const handle_CLR = () => {
            this.graphics.clearLastPt();
            // this.graphics.clear();
        };
        const handle_CMP = () => {
            this.alu('CMP', operandA, operandB);
        };
        const handle_CMPI = () => {
            this.alu('CMPI', operandA, operandB);
        };
        const handle_DEC = () => {
            this.alu('DEC', operandA, operandB);
        };
        const handle_DIV = () => {
            this.alu('DIV', operandA, operandB);
        };
        const handle_DRW = () => {
            this.graphics.drawSprt(this.reg[operandA], this.reg[operandB]);
        };
        const handle_DRWB = () => {
            this.graphics.drawBlc(this.reg[operandA], this.reg[operandB]);
        }
        const handle_HLT = () => {
            this.stopClock();
        };
        const handle_INC = () => {
            this.alu('INC', operandA);
        };
        const handle_INT = () => {
            const intNum = this.reg[operandA];
            // this.reg[IM] |= intNum;
            this.raiseInterrupt(intNum);
        };
        const handle_IRET = () => {
            for(let r = 6; r >= 0; r--) {
                this.reg[r] = _pop();
            }
            this.reg.FL = _pop();
            this.reg.PC = _pop();
            this.calling = true;
            this.interruptsEnabled = true;
        };
        const handle_JEQ = () => {
            if (this.checkFlag(FLAG_EQ)) {
                this.reg.PC = this.reg[operandA];
                this.calling = true;
            }
        };
        const handle_JEQI = () => {
            if (this.checkFlag(FLAG_EQ)) {
                this.reg.PC = operandA;
                this.calling = true;
            }
        };
        const handle_JGT = () => {
            if (this.checkFlag(FLAG_GT)) {
                this.reg.PC = this.reg[operandA];
                this.calling = true;
            }
        };
        const handle_JGTI = () => {
            if (this.checkFlag(FLAG_GT)) {
                this.reg.PC = operandA;
                this.calling = true;
            }
        };
        const handle_JLT = () => {
            if (this.checkFlag(FLAG_LT)) {
                this.reg.PC = this.reg[operandA];
                this.calling = true;
            }
        };
        const handle_JMP = () => {
            this.reg.PC = this.reg[operandA];
            this.calling = true;
        };
        const handle_JMPI = () => {
            this.reg.PC = operandA;
            this.calling = true;
        };
        const handle_JNE = () => {
            if (!this.checkFlag(FLAG_EQ)) {
                this.reg.PC = this.reg[operandA];
                this.calling = true;
            }
        };
        const handle_LD = () => {
            this.reg[operandA] = this.ram.read(this.reg[operandB]);
        };
        const handle_LDI = () => {
            this.reg[operandA] = operandB;
        };
        const handle_MOD = () => {
            this.alu('MOD', operandA, operandB);
        };
        const handle_MUL = () => {
            this.alu('MUL', operandA, operandB);
        };
        const handle_NOP = () => {
            return;
        };
        const handle_NOT = () => {
            this.alu('NOT', operandA);
        };
        const handle_OR = () => {
            this.alu('OR', operandA, operandB);
        };
        const handle_POP = () => {
            this.reg[operandA] = _pop();
        };
        const handle_PRA = () => {
            this.graphics.text(this.reg[operandA]);
            // process.stdout.write(String.fromCharCode(this.reg[operandA]));
            // console.log(
            //     String.fromCharCode(this.reg[operandA])
            // );
        };
        const handle_PRN = () => {
            console.log(this.reg[operandA]);
        };
        const handle_PUSH = () => {
            this.alu('DEC', SP);
            this.ram.write(this.reg[SP], this.reg[operandA]);
        };
        const handle_RET = () => {
            this.reg.PC = _pop();
            // this.calling = true; this is proper but breaks the code for some reason. prob should investigate
        };
        const handle_ST = () => {
            this.ram.write(this.reg[operandA], this.reg[operandB]);
        };
        const handle_SUB = () => {
            this.alu('SUB', operandA, operandB);
        };
        const handle_SUBI = () => {
            this.alu('SUBI', operandA, operandB);
        };
        const handle_XOR = () => {
            this.alu('XOR', operandA, operandB);
        };

        const branchTable = [];
        branchTable[ADD] = handle_ADD;
        branchTable[ADDI] = handle_ADDI;
        branchTable[AND] = handle_AND;
        branchTable[CALL] = handle_CALL;
        branchTable[CALLI] = handle_CALLI;
        branchTable[CLR] = handle_CLR;
        branchTable[CMP] = handle_CMP;
        branchTable[CMPI] = handle_CMPI;
        branchTable[DEC] = handle_DEC;
        branchTable[DIV] = handle_DIV;
        branchTable[DRW] = handle_DRW;
        branchTable[DRWB] = handle_DRWB;
        branchTable[HLT] = handle_HLT;
        branchTable[INC] = handle_INC;
        branchTable[INT] = handle_INT;
        branchTable[IRET] = handle_IRET;
        branchTable[JEQ] = handle_JEQ;
        branchTable[JEQI] = handle_JEQI;
        branchTable[JGT] = handle_JGT;
        branchTable[JGTI] = handle_JGTI;
        branchTable[JLT] = handle_JLT;
        branchTable[JNE] = handle_JNE;
        branchTable[JMP] = handle_JMP;
        branchTable[JMPI] = handle_JMPI;
        branchTable[JLT] = handle_JLT;
        branchTable[LD] = handle_LD;
        branchTable[LDI] = handle_LDI;
        branchTable[MOD] = handle_MOD;
        branchTable[MUL] = handle_MUL;
        branchTable[NOP] = handle_NOP;
        branchTable[NOT] = handle_NOT;
        branchTable[OR] = handle_OR;
        branchTable[POP] = handle_POP;
        branchTable[PRA] = handle_PRA;
        branchTable[PRN] = handle_PRN;
        branchTable[PUSH] = handle_PUSH;
        branchTable[RET] = handle_RET;
        branchTable[ST] = handle_ST;
        branchTable[SUB] = handle_SUB;
        branchTable[SUBI] = handle_SUBI;
        branchTable[XOR] = handle_XOR;

        let handler = branchTable[this.reg.IR];

        handler();
        // console.log('--------------------------');
        if (!this.calling) {
            this.reg.PC += nextInstruction + 1;
        }
        this.calling = false;

    }
}

module.exports = CPU;
