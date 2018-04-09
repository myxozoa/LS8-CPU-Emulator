/**
 * RAM access
 */
class RAM {
    constructor(size) {
        this.mem = new Array(size);
        this.mem.fill(0);
    }

    /**
     * Write (store) MDR value at address MAR
     */
    write(MAR, MDR) {
        this.mem[MAR] = MDR;
        // !!! IMPLEMENT ME
        // write the value in the MDR to the address MAR
    }

    /**
     * Read (load) MDR value from address MAR
     * 
     * @returns MDR
     */
    read(MAR) {
        console.log(this.mem[MAR].toString(2));
        return parseInt(this.mem[MAR], 2);
        // !!! IMPLEMENT ME
        // Read the value in address MAR and return it
    }
}

module.exports = RAM;