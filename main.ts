//% color=#0fbc11 icon="\uf11c" block="Keypad 4x4"
namespace keypad4x4 {

    let rows: DigitalPin[] = []
    let cols: DigitalPin[] = []

    let keys = [
        ["1", "2", "3", "A"],
        ["4", "5", "6", "B"],
        ["7", "8", "9", "C"],
        ["*", "0", "#", "D"]
    ]

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

    //% block="tecla pressionada"
    export function readKey(): string {

        for (let i = 0; i < 4; i++) {

            pins.digitalWritePin(rows[i], 0)

            for (let j = 0; j < 4; j++) {

                if (pins.digitalReadPin(cols[j]) == 0) {
                    basic.pause(200)

                    while (pins.digitalReadPin(cols[j]) == 0) { }

                    pins.digitalWritePin(rows[i], 1)
                    return keys[i][j]
                }
            }

            pins.digitalWritePin(rows[i], 1)
        }

        return ""
    }
}