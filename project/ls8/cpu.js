/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
const ADD = 0b10101000;
const AND = 0b10110011;
const CALL = 0b01001000;
const CMP = 0b10100000;
const DEC = 0b01111001;
const DIV = 0b10101011;
const HLT = 0b00000001;
const INC = 0b01111000;
const INT = 0b01001010;
const IRET = 0b00001011;
const JEQ = 0b01010001;
const JGT = 0b01010100;
const JLT = 0b01010011;
const JMP = 0b01010000;
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
const XOR = 0b10110010;

class CPU {
    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

        // Special-purpose registers
        this.reg.PC = 0; // Program Counter
    }

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        // console.log('address: ', address);
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
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
        switch (op) {
            case 'ADD':
                this.reg[regA] = this.reg[regA] + this.reg[regB];
                break;
            case 'SUB':
                this.reg[regA] = this.reg[regA] - this.reg[regB];
                break;
            case 'MUL':
                // !!! IMPLEMENT ME
                this.reg[regA] = this.reg[regA] * this.reg[regB];
                break;
            case 'DIV':
                if (this.reg[regB] === 0) {
                    console.error('Divide by zero error');
                    this.stopClock();
                } else {
                    this.reg[regA] = this.reg[regA] / this.reg[regB];
                }
                break;
            case 'INC':
                this.reg[regA] += 1;
                break;
            case 'DEC':
                this.reg[regA] -= 1;
                break;
            case 'CMP':
                if (this.reg[regA] > this.reg[regB]) this.reg[4] = 0b00000010;
                if (this.reg[regA] < this.reg[regB]) this.reg[4] = 0b00000100;
                if (this.reg[regA] === this.reg[regB]) this.reg[4] = 0b00000001;
                break;
            case 'MOD':
                if (this.reg[regB] === 0) {
                    console.error('Divide by zero error');
                    this.stopClock();
                } else {
                    this.reg[regA] = this.reg[regA] % this.reg[regB];
                }
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // console.log(this.ram);
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)

        // !!! IMPLEMENT ME
        let IR = this.ram.read(this.reg.PC);

        // Debugging output
        // console.log(`${this.reg.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        // !!! IMPLEMENT ME
        let operandA = this.ram.read(this.reg.PC + 1);
        let operandB = this.ram.read(this.reg.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        // !!! IMPLEMENT ME
        // console.log('OP-A: ', operandA);
        // console.log('OP-B: ', operandB);
        // console.log('IR: ', IR.toString(2));
        // console.log('PC: ', this.reg.PC);
        // console.log('RAM[0]: ', this.ram.mem[0]);
        // console.log('RAM[1]: ', this.ram.mem[1]);
        // console.log('RAM[2]: ', this.ram.mem[2]);
        // console.log('RAM[3]: ', this.ram.mem[3]);
        // console.log('RAM[4]: ', this.ram.mem[4]);
        // console.log('RAM[5]: ', this.ram.mem[5]);
        // console.log('REG: ', this.reg);

        switch (IR) {
            case ADD:
                this.apu('ADD', operandA, operandB);
                break;
            case AND:
                this.reg[operandA] = this.reg[operandA] & this.reg[operandB];
                break;
            case CALL:
                // IDK the stack yet
                break;
            case CMP:
                this.apu('CMP', operandA, operandB);
                break;
            case DEC:
                this.apu('DEC', operandA, operandB);
                break;
            case HLT:
                // console.log('halting');
                this.stopClock();
                break;
            case DIV:
                this.apu('DIV', operandA, operandB);
                break;
            case INC:
                this.apu('INC', operandA);
            case INT:
                // IDK interrupts yet
                break;
            case IRET:
                // IDK interrupts yet
                break;
            case JEQ:
                if (this.reg[4] & (0b1 !== 0)) {
                    this.reg.PC = this.reg[operandA];
                }
                break;
            case JGT:
                if (this.reg[4] & (0b10 !== 0)) {
                    this.reg.PC = this.reg[operandA];
                }
                break;
            case JLT:
                if (this.reg[4] & (0b100 !== 0)) {
                    this.reg.PC = this.reg[operandA];
                }
                break;
            case JMP:
                this.reg.PC = this.reg[operandA];
                break;
            case JNE:
                if (this.reg[4] & (0b1 === 0)) {
                    this.reg.PC = this.reg[operandA];
                }
                break;
            case LD:
                this.reg[operandA] = this.reg[operandB];
                break;
            case LDI:
                // console.log('its doing LDI');
                this.reg[operandA] = operandB;
                break;
            case MOD:
                this.apu('MOD', operandA, operandB);
                break;
            case MUL:
                this.apu('MUL', operandA, operandB);
                break;
            case NOP:
                break;
            case NOT:
                this.reg[operandA] = ~this.reg[operandA];
                break;
            case OR:
                this.reg[operandA] = this.reg[operandA] | this.reg[operandB];
                break;
            case POP:
                // IDK the stack yet
                break;
            case PRA:
                console.log(String.fromCharCode(this.reg[operandA]));  // not completely sure
                break;
            case PRN:
                console.log(this.reg[operandA]);
                break;
            case PUSH:
                // IDK the stack yet
                break;
            case RET:
                // IDK the stack yet
                break;
            case ST:
                this.reg[operandB] = this.reg[operandA];
                break;
            case SUB:
                this.apu('SUB', operandA, operandB);
                break;
            case XOR:
                this.reg[operandA] = this.reg[operandA] ^ this.reg[operandB];
                break;
            default:
                break;
        }
        // console.log('--------------------------')

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.

        // !!! IMPLEMENT ME
        // console.log('jmp: ', (IR & 11000000) >> 6);
        this.reg.PC += ((IR & 11000000) >>> 6) + 1;
    }
}

module.exports = CPU;
