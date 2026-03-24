namespace keypad4x4 {

    let rows: DigitalPin[] = []
    let cols: DigitalPin[] = []

    let keys = [
        ["1", "2", "3", "A"],
        ["4", "5", "6", "B"],
        ["7", "8", "9", "C"],
        ["*", "0", "#", "D"]
    ]

    // Inicialização
    export function init(
        r1: DigitalPin, r2: DigitalPin, r3: DigitalPin, r4: DigitalPin,
        c1: DigitalPin, c2: DigitalPin, c3: DigitalPin, c4: DigitalPin
    ): void {

        rows = [r1, r2, r3, r4]
        cols = [c1, c2, c3, c4]

        // Configura linhas como saída
        for (let r of rows) {
            pins.digitalWritePin(r, 1)
        }

        // Configura colunas como entrada com pull-up
        for (let c of cols) {
            pins.setPull(c, PinPullMode.PullUp)
        }
    }

    // Lê tecla pressionada
    export function readKey(): string {

        for (let i = 0; i < 4; i++) {

            // Ativa uma linha por vez
            pins.digitalWritePin(rows[i], 0)

            for (let j = 0; j < 4; j++) {

                if (pins.digitalReadPin(cols[j]) == 0) {
                    basic.pause(200) // debounce

                    // Espera soltar
                    while (pins.digitalReadPin(cols[j]) == 0) { }

                    pins.digitalWritePin(rows[i], 1)
                    return keys[i][j]
                }
            }

            pins.digitalWritePin(rows[i], 1)
        }

        return ""
    }
}basic.forever(function () {
	
})
