LDI R0, 0xF9
ST R0, R1 ; store address of the frame interrupt into 0xF9 (the I0 Vector)
LDI R5, 2 ; set keyboard interrupt
; LDI R1, 20 ; ground level
; LDI R2, 2 ; gravity
LDI R3, 10 ; player x
LDI R4, 10 ; player y

LOOP:
LDI R1, 0xF4
LD R2, R1
LDI R1, 119 ; w key
CMP R2, R1
CALLI MOVEUP
LDI R1, 115 ; s key
CMP R2, R1
CALLI MOVEDOWN
LDI R1, 97 ; a key
CMP R2, R1
CALLI MOVELEFT
LDI R1, 100 ; d key
CMP R2, R1
CALLI MOVERIGHT
DRW R3, R4
JMPI LOOP

MOVEUP:
JEQI Y
RET
Y:
DEC R4
RET

MOVEDOWN:
JEQI R
RET
R:
INC R4
RET

MOVELEFT:
JEQI D
RET
D:
DEC R3
RET

MOVERIGHT:
JEQI Z
RET
Z:
INC R3
RET


; HITFLOOR:
