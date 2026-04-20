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
    let texto = ""
    let handler: (t: string) => void = null

    // iniciar com função de saída
    //% block="função de saída"
    export function iniciar(saida: (t: string) => void): boolean {
        texto = ""
        handler = saida

        keypad4x4.onKeyPressed(function (tecla: string) {

            if (tecla == "*") {
                if (texto.length > 0) {
                    texto = texto.substr(0, texto.length - 1)
                }

            } else if (tecla == "#") {
                // confirmação opcional (não faz nada por enquanto)

            } else {
                texto += tecla
            }

            if (handler) {
                handler(texto)
            }
        })
    }

    // limpar manualmente
    //% block="limpar manualmente"
    export function limpar(): boolean {
        texto = ""
        if (handler) {
            handler(texto)
        }
    }

    // obter valor digitado
    //% block="valor digitado"
    export function valor(): string {
        return texto
    }
}
