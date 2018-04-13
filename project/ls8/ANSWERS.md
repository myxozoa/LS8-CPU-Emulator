<!-- Answers to the Short Answer Essay Questions go here -->

### 1. Explain how the CPU provides concurrency:
These days using more threads (and more cores) to significantly increase the number of possible operations that can be done at once, and each one uses task scheduling (time sharing/ time slicing) to keep more than one task going at once

### 2. Describe assembly language and machine language:
Machine language is the bits and bytes actually interpreted by a CPU but since its so cumbersome for a human to write in we use assembly language which has a 1:1 mapping but still provides the necessary abstraction to write complex programs.


### 3. Why is 3D performance so much higher with a graphics card than without?
3D math (quaternions, transforms, ray casting etc) all benefit extremely well from parallellism (basically doing hundreds of thousands of multiply / add operations at once in parallell) as well as from all the specific optimizations that are done with a specialized processing unit just for graphics.


### 4. Suggest the role that graphics cards play in machine learning:
GPU computing is a big thing right now, especially in ML because of the increases in learning times it can provide (ive seen numbers given from 20-40x over CPU) because of the great opportunities for parallelism and also the ease of creating large clusters of GPUs (basically supercomputers).

-----

#### Convert `11001111` binary

to hex: `0xCF`

to decimal: `207`

#### Convert `4C` hex

to binary: `1001100`

to decimal: `76`

#### Convert `68` decimal

to binary: `1000100`

to hex: `44`