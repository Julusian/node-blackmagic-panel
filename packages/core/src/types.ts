import type { EventEmitter } from 'eventemitter3'
import type { DeviceModelId, KeyId } from './id.js'
import type { HIDDeviceInfo } from './hid-device.js'
import type {
	BlackmagicPanelButtonControlDefinition,
	BlackmagicPanelControlDefinition,
	BlackmagicPanelTBarControlDefinition,
} from './controlDefinition.js'

export type BlackmagicPanelEvents = {
	down: [control: BlackmagicPanelButtonControlDefinition]
	up: [control: BlackmagicPanelButtonControlDefinition]
	tbar: [control: BlackmagicPanelTBarControlDefinition, percent: number]
	batteryLevel: [percent: number]
	error: [err: unknown]
}

export interface BlackmagicPanel extends EventEmitter<BlackmagicPanelEvents> {
	/** List of the controls on this panel */
	readonly CONTROLS: Readonly<BlackmagicPanelControlDefinition[]>

	/** The model of this device */
	readonly MODEL: DeviceModelId
	/** The name of the product/model */
	readonly PRODUCT_NAME: string

	/**
	 * Close the device
	 */
	close(): Promise<void>

	/**
	 * Get information about the underlying HID device
	 */
	getHidDeviceInfo(): Promise<HIDDeviceInfo>

	/**
	 * Get the current battery level of the panel, if supported
	 */
	getBatteryLevel(): Promise<number | null>

	/**
	 * Fills the given key with a solid color.
	 *
	 * @param {number} keyIndex The key to fill
	 * @param {number} r The color's red value. 0 - 255
	 * @param {number} g The color's green value. 0 - 255
	 * @param {number} b The color's blue value. 0 -255
	 */
	setButtonColor(keyIndex: KeyId, r: boolean, g: boolean, b: boolean): Promise<void>

	/**
	 * Fill multiple keys with colors.
	 * @param values Keys and colors to set
	 */
	setButtonColors(values: BlackmagicPanelSetButtonColorValue[]): Promise<void>

	/**
	 * Set the state of the T-Bar LEDs
	 * @param leds Led states
	 */
	setTbarLeds(leds: boolean[]): Promise<void>

	/**
	 * Clears the given key.
	 *
	 * @param {number} keyIndex The key to clear
	 */
	clearKey(keyIndex: KeyId): Promise<void>

	/**
	 * Clears all keys.
	 */
	clearPanel(): Promise<void>

	// /**
	//  * Sets the brightness of the keys on the Stream Deck
	//  *
	//  * @param {number} percentage The percentage brightness
	//  */
	// setBrightness(percentage: number): Promise<void>

	/**
	 * Get firmware version of the Panel
	 */
	getFirmwareVersion(): Promise<string>

	/**
	 * Get serial number of the Panel
	 */
	getSerialNumber(): Promise<string>
}

export interface BlackmagicPanelSetButtonColorValue {
	keyId: KeyId
	red: boolean
	green: boolean
	blue: boolean
}
