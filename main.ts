//% color=#0fbc11 icon="\uf11c" block="Keypad 4x4"
namespace keypad4x4 {

    let rows: DigitalPin[] = []
    let cols: DigitalPin[] = []

    let keys = [
        ["D", "C", "B", "A"],
        ["#", "9", "6", "3"],
        ["0", "8", "5", "2"],
        ["*", "7", "4", "1"]
    ]

    let lastKey = ""

    //% block="iniciar keypad linhas %r1 %r2 %r3 %r4 colunas %c1 %c2 %c3 %c4"
    export function init(
        r1: DigitalPin, r2: DigitalPin, r3: DigitalPin, r4: DigitalPin,
        c1: DigitalPin, c2: DigitalPin, c3: DigitalPin, c4: DigitalPin
    ): void {

        rows = [r1, r2, r3, r4]
        cols = [c1, c2, c3, c4]

        for (let r of rows) {
            pins.digitalWritePin(r, 1)
        }

        for (let c of cols) {
            pins.setPull(c, PinPullMode.PullUp)
        }
    }

    //% block="inverter linhas e colunas"
    export function invertPins(): void {
        let temp = rows
        rows = cols
        cols = temp
    }

    //% block="definir layout padrão"
    export function defaultLayout(): void {
        keys = [
            ["D", "C", "B", "A"],
            ["#", "9", "6", "3"],
            ["0", "8", "5", "2"],
            ["*", "7", "4", "1"]
        ]
    }

    //% block="definir layout personalizado %k"
    export function setLayout(k: string[][]): void {
        keys = k
    }

    function scanKey(): string {

        for (let i = 0; i < 4; i++) {

            pins.digitalWritePin(rows[i], 0)

            for (let j = 0; j < 4; j++) {

                if (pins.digitalReadPin(cols[j]) == 0) {

                    basic.pause(150)

                    while (pins.digitalReadPin(cols[j]) == 0) { }

                    pins.digitalWritePin(rows[i], 1)
                    return keys[i][j]
                }
            }

            pins.digitalWritePin(rows[i], 1)
        }

        return ""
    }

    //% block="tecla pressionada"
    export function readKey(): string {
        return scanKey()
    }

    //% block="tecla foi pressionada?"
    export function keyPressed(): boolean {
        let k = scanKey()
        if (k != "") {
            lastKey = k
            return true
        }
        return false
    }

    //% block="última tecla"
    export function lastKeyPressed(): string {
        return lastKey
    }

    // EVENTO (nível profissional 🔥)
    //% block="quando tecla pressionada"
    export function onKeyPressed(handler: (key: string) => void) {

        control.inBackground(function () {
            while (true) {
                let k = scanKey()
                if (k != "") {
                    handler(k)
                }
                basic.pause(50)
            }
        })
    }
    //% color=#1E90FF icon="\uf108" block="LCD 16x02 I2C"
namespace lcd16x02 {
    let i2cAddr = 0x27 // Endereço padrão da maioria dos módulos I2C
    let BK = 0x08
    let RS = 0x00

    function setReg(dat: number): void {
        pins.i2cWriteNumber(i2cAddr, dat, NumberFormat.UInt8BE)
    }

    function send(dat: number): void {
        let d = dat | BK
        setReg(d | 0x04)
        setReg(d & 0xFB)
    }

    function write(dat: number, mode: number): void {
        RS = mode
        send((dat & 0xF0) | RS)
        send(((dat << 4) & 0xF0) | RS)
    }

    //% block="inicializar LCD no endereço %addr"
    export function init(addr: number): void {
        i2cAddr = addr
        basic.pause(50)
        write(0x33, 0)
        write(0x32, 0)
        write(0x28, 0)
        write(0x0C, 0)
        write(0x06, 0)
        clear()
    }

    //% block="limpar LCD"
    export function clear(): void {
        write(0x01, 0)
        basic.pause(2)
    }

    //% block="exibir texto %s na linha %l coluna %c"
    export function showString(s: string, l: number, c: number): void {
        let addr = (l == 1 ? 0 : 0x40) + c
        write(0x80 | addr, 0)
        for (let i = 0; i < s.length; i++) {
            write(s.charCodeAt(i), 1)
        }
    }

    //% block="desligar luz de fundo"
    export function backlightOff(): void {
        BK = 0x00
        write(0, 0)
    }

    //% block="ligar luz de fundo"
    export function backlightOn(): void {
        BK = 0x08
        write(0, 0)
    }
}
    //% color=#1E90FF icon="\uf1ec" block="Calculadora Robot:bit"
namespace calculadora {
    let num1 = ""
    let num2 = ""
    let op = ""
    let calculando = false

    //% block="processar tecla da calculadora %tecla"
    export function processar(tecla: string): void {
        if (tecla == "C") { // Limpar tudo
            num1 = ""
            num2 = ""
            op = ""
            calculando = false
            lcd16x02.clear()
        } 
        else if (tecla == "+" || tecla == "-" || tecla == "A" || tecla == "B") { 
            // Vamos usar A para +, B para -, C para *, D para / se desejar
            if (tecla == "A") op = "+"
            if (tecla == "B") op = "-"
            calculando = true
            lcd16x02.showString(op, 0, 15)
        } 
        else if (tecla == "D") { // Usaremos D como o sinal de "="
            let resultado = 0
            let n1 = parseFloat(num1)
            let n2 = parseFloat(num2)
            
            if (op == "+") resultado = n1 + n2
            if (op == "-") resultado = n1 - n2
            
            lcd16x02.clear()
            lcd16x02.showString("Res: " + resultado, 1, 0)
            num1 = "" + resultado
            num2 = ""
            calculando = false
        } 
        else { // Digitar números
            if (!calculando) {
                num1 += tecla
                lcd16x02.showString(num1, 0, 0)
            } else {
                num2 += tecla
                lcd16x02.showString(num2, 1, 0)
            }
        }
    }
}
}
