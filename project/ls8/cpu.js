/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
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
            case 'MUL':
                // !!! IMPLEMENT ME
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
        // console.log('IR: ', IR.toString());
        // console.log('PC: ', this.reg.PC);
        // console.log('RAM[0]: ', this.ram.mem[0]);
        // console.log('RAM[1]: ', this.ram.mem[1]);
        // console.log('RAM[2]: ', this.ram.mem[2]);
        // console.log('RAM[3]: ', this.ram.mem[3]);
        // console.log('RAM[4]: ', this.ram.mem[4]);
        // console.log('RAM[5]: ', this.ram.mem[5]);


        switch (IR.toString()) {
            case '10011001': //LDI
            // console.log('its doing LDI');
                this.ram.write(operandA, operandB);
                break;
            case '01000011': // PRN
                // console.log('its printing');
                console.log(this.ram.read(operandA));
                break;
            case '00000001': // HLT
                // console.log('halting');
                this.stopClock();
            default:
                break;
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.

        // !!! IMPLEMENT ME
        // console.log('what');
        this.reg.PC += ( parseInt(IR.toString().slice(0, 2), 2) + 1 );

        // if(this.reg.PC > 10) {
        //     this.stopClock();
        // }

    }
}

module.exports = CPU;
