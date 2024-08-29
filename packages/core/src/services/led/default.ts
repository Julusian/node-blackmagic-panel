import type { HIDDevice } from '../../hid-device'
import type { BlackmagicPanelButtonControlDefinition, BlackmagicPanelControlDefinition } from '../../controlDefinition'
import type { BlackmagicPanelLedService } from './interface'
import { uint8ArrayToDataView } from '../../util'

export class DefaultLedService implements BlackmagicPanelLedService {
	readonly #device: HIDDevice
	readonly #controls: readonly BlackmagicPanelControlDefinition[]

	readonly #bufferSize: number = 32 // Future: this may need to vary

	#lastPrimaryBuffer: Uint8Array

	constructor(device: HIDDevice, controls: readonly BlackmagicPanelControlDefinition[]) {
		this.#device = device
		this.#controls = controls

		this.#lastPrimaryBuffer = this.#createBuffer(null)

		// TODO - flashing buffers?
	}

	#createBuffer(copyExisting: Uint8Array | null): Uint8Array {
		const buffer = new Uint8Array(this.#bufferSize)
		if (copyExisting) {
			buffer.set(this.#lastPrimaryBuffer)
		} else {
			buffer[0] = 0x02
		}

		return buffer
	}

	// nocommit - set tbar

	async setButtonColor(
		control: BlackmagicPanelButtonControlDefinition,
		red: boolean,
		green: boolean,
		blue: boolean,
	): Promise<void> {
		this.#lastPrimaryBuffer = this.#createBuffer(this.#lastPrimaryBuffer)

		const buttonOffset = 3
		const firstBitIndex = (control.encodedIndex - 1) * 3
		const firstByteIndex = Math.floor(firstBitIndex / 8)
		const firstBitIndexInValue = firstBitIndex % 8

		const view = uint8ArrayToDataView(this.#lastPrimaryBuffer)

		let uint16Value = view.getUint16(buttonOffset + firstByteIndex, true)
		uint16Value = maskValue(uint16Value, 1 << firstBitIndexInValue, red)
		uint16Value = maskValue(uint16Value, 1 << (firstBitIndexInValue + 1), green)
		uint16Value = maskValue(uint16Value, 1 << (firstBitIndexInValue + 2), blue)

		view.setUint16(buttonOffset + firstByteIndex, uint16Value, true)

		await this.#device.sendReports([this.#lastPrimaryBuffer])
	}

	async clearPanel(): Promise<void> {
		this.#lastPrimaryBuffer = this.#createBuffer(null)

		await this.#device.sendReports([this.#lastPrimaryBuffer])
		// TODO - flashing buffers?
	}
}

function maskValue(value: number, mask: number, set: boolean): number {
	if (set) {
		return value | mask
	} else {
		return value & ~mask
	}
}
