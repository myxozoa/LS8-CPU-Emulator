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
        this.reg[8] = 0xF4; // SP

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
            case 'AND':
                this.reg[regA] = this.reg[regA] & this.reg[regB];
                break;
            case 'NOT':
                this.reg[regA] = ~this.reg[regA];
                break;
            case 'OR':
                this.reg[regA] = this.reg[regA] | this.reg[regB];
                break;
            case 'XOR':
                this.reg[regA] = this.reg[regA] ^ this.reg[regB];
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        let IR = this.ram.read(this.reg.PC);
        const nextInstruction = ((IR & 11000000) >>> 6);

        let operandA = this.ram.read(this.reg.PC + 1);
        let operandB = this.ram.read(this.reg.PC + 2);

        let call = false;

        // console.log('OP-A: ', operandA);
        // console.log('OP-B: ', operandB);
        // console.log('PC: ', this.reg.PC);
        // console.log('SP: ', this.reg[8]);
        // console.log('RAM[0]: ', this.ram.mem[0]);
        // console.log('RAM[1]: ', this.ram.mem[1]);
        // console.log('RAM[2]: ', this.ram.mem[2]);
        // console.log('RAM[3]: ', this.ram.mem[3]);
        // console.log('RAM[4]: ', this.ram.mem[4]);
        // console.log('RAM[5]: ', this.ram.mem[5]);
        // console.log('RAM[F4]: ', this.ram.mem[0xF4]);
        // console.log('RAM[F3]: ', this.ram.mem[0xF3]);
        // console.log('RAM[F2]: ', this.ram.mem[0xF2]);
        // console.log('REG: ', this.reg);
        // console.log('IR: ', IR.toString(2));

        const handle_ADD = () => { this.alu('ADD', operandA, operandB); }
        const handle_AND = () => { this.alu('AND', operandA, operandB); }
        const handle_CALL = () => { this.alu('DEC', 8); this.ram.write(this.reg[8], this.reg.PC + nextInstruction); this.reg.PC = this.reg[operandA]; call = true; }
        const handle_CMP = () => { this.alu('CMP', operandA, operandB); }
        const handle_DEC = () => { this.alu('DEC', operandA, operandB); }
        const handle_HLT = () => { this.stopClock(); }
        const handle_DIV = () => { this.alu('DIV', operandA, operandB); }
        const handle_INC = () => { this.alu('INC', operandA); }
        const handle_INT = () => { /* IDK interrupts yet */ }
        const handle_IRET = () => { /* IDK interrupts yet */ }
        const handle_JEQ = () => { if (this.reg[4] & (0b1 !== 0)) this.reg.PC = this.reg[operandA]; }
        const handle_JGT = () => { if (this.reg[4] & (0b10 !== 0)) this.reg.PC = this.reg[operandA]; }
        const handle_JLT = () => { if (this.reg[4] & (0b100 !== 0)) this.reg.PC = this.reg[operandA]; }
        const handle_JMP = () => { this.reg.PC = this.reg[operandA]; }
        const handle_JNE = () => { if (this.reg[4] & (0b1 === 0)) this.reg.PC = this.reg[operandA]; }
        const handle_LD = () => { this.reg[operandA] = this.reg[operandB]; }
        const handle_LDI = () => { this.reg[operandA] = operandB; }
        const handle_MOD = () => { this.alu('MOD', operandA, operandB); }
        const handle_MUL = () => { this.alu('MUL', operandA, operandB); }
        const handle_NOP = () => { return; }
        const handle_NOT = () => { this.alu('NOT', operandA); }
        const handle_OR = () => { this.alu('OR', operandA, operandB); }
        const handle_POP = () => { this.reg[operandA] = this.ram.read(this.reg[8]); this.alu('INC', 8); }
        const handle_PRA = () => { console.log(String.fromCharCode(this.reg[operandA])); /* not completely sure */ }
        const handle_PRN = () => { console.log(this.reg[operandA]); }
        const handle_PUSH = () => { this.alu('DEC', 8); this.ram.write(this.reg[8], this.reg[operandA]); }
        const handle_RET = () => { this.reg.PC = this.ram.read(this.reg[8]); this.alu('INC', 7); }
        const handle_ST = () => { this.reg[operandB] = this.reg[operandA]; }
        const handle_SUB = () => { this.alu('SUB', operandA, operandB); }
        const handle_XOR = () => { this.alu('XOR', operandA, operandB); }

        const branchTable = [];
        branchTable[ADD] = handle_ADD;
        branchTable[AND] = handle_AND;
        branchTable[CALL] = handle_CALL;
        branchTable[CMP] = handle_CMP;
        branchTable[DEC] = handle_DEC;
        branchTable[HLT] = handle_HLT;
        branchTable[DIV] = handle_DIV;
        branchTable[INC] = handle_INC;
        branchTable[INT] = handle_INT;
        branchTable[IRET] = handle_IRET;
        branchTable[JEQ] = handle_JEQ;
        branchTable[JGT] =  handle_JGT;
        branchTable[JLT] = handle_JLT;
        branchTable[JMP] = handle_JMP;
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
        branchTable[XOR] = handle_XOR;


        let handler = branchTable[IR];

        handler();
        // console.log('--------------------------')
        if(!call) {
            this.reg.PC += nextInstruction + 1;
        }

        // if(this.reg.PC > 30) {
        //     this.stopClock();
        // }
    }
}

module.exports = CPU;
