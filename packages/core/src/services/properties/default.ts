import type { HIDDevice } from '../../hid-device.js'
import type { PropertiesService } from './interface.js'

export class DefaultPropertiesService implements PropertiesService {
	readonly #device: HIDDevice

	constructor(device: HIDDevice) {
		this.#device = device
	}

	public async getBatteryLevel(): Promise<number | null> {
		const val = await this.#device.getFeatureReport(6, 3)
		return val[2] / 100
	}

	// public async setBrightness(percentage: number): Promise<void> {
	// 	if (percentage < 0 || percentage > 100) {
	// 		throw new RangeError('Expected brightness percentage to be between 0 and 100')
	// 	}

	// 	// prettier-ignore
	// 	const brightnessCommandBuffer = new Uint8Array([
	// 		0x03,
	// 		0x08, percentage, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	// 		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	// 		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	// 		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
	// 	]);
	// 	await this.#device.sendFeatureReport(brightnessCommandBuffer)
	// }

	public async getFirmwareVersion(): Promise<string> {
		// const val = await this.#device.getFeatureReport(5, 32)
		// const end = val[1] + 2
		// return new TextDecoder('ascii').decode(val.subarray(6, end))
		// nocommit
		throw new Error('Not implemented')
	}

	public async getSerialNumber(): Promise<string> {
		// const val = await this.#device.getFeatureReport(6, 32)
		// const end = val[1] + 2
		// return new TextDecoder('ascii').decode(val.subarray(2, end))
		// nocommit
		throw new Error('Not implemented')
	}
}
