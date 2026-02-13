import {
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	model,
	output,
	signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideBrnTimeInput } from './brn-time-input.token';

export type BrnTimePeriod = 'AM' | 'PM';

export interface BrnTimeValue {
	hours: number;
	minutes: number;
	period: BrnTimePeriod;
}

/** Segment types that can be focused within the time input. */
export type BrnTimeSegment = 'hours' | 'minutes' | 'period';

let nextId = 0;

@Component({
	selector: 'brn-time-input',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		provideBrnTimeInput(BrnTimeInput),
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BrnTimeInput),
			multi: true,
		},
	],
	host: {
		role: 'group',
		'[attr.aria-label]': '"Time input"',
		'[attr.data-disabled]': 'disabled() || null',
		'[id]': 'id()',
	},
	template: `<ng-content />`,
})
export class BrnTimeInput implements ControlValueAccessor {
	private readonly _id = signal(`brn-time-input-${nextId++}`);
	readonly id = this._id.asReadonly();

	/** The current time value. */
	readonly value = model<BrnTimeValue>({ hours: 12, minutes: 0, period: 'AM' });

	/** Whether the input is disabled. */
	readonly disabled = model(false);

	/** Emitted when the value changes. */
	readonly timeChange = output<BrnTimeValue>();

	/** The currently focused segment. */
	readonly activeSegment = signal<BrnTimeSegment | null>(null);

	/** Formatted display string for each segment. */
	readonly displayHours = computed(() => {
		const h = this.value().hours;
		return h.toString().padStart(2, '0');
	});

	readonly displayMinutes = computed(() => {
		return this.value().minutes.toString().padStart(2, '0');
	});

	readonly displayPeriod = computed(() => this.value().period);

	// -- CVA --
	private _onChange: (value: BrnTimeValue) => void = () => {};
	private _onTouched: () => void = () => {};

	writeValue(value: BrnTimeValue | null): void {
		if (value) {
			this.value.set(value);
		}
	}

	registerOnChange(fn: (value: BrnTimeValue) => void): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	// -- Segment manipulation --

	/** Increment the given segment value. */
	incrementSegment(segment: BrnTimeSegment): void {
		if (this.disabled()) return;
		const current = this.value();
		let next: BrnTimeValue;

		switch (segment) {
			case 'hours': {
				const h = current.hours >= 12 ? 1 : current.hours + 1;
				next = { ...current, hours: h };
				break;
			}
			case 'minutes': {
				const m = current.minutes >= 59 ? 0 : current.minutes + 1;
				next = { ...current, minutes: m };
				break;
			}
			case 'period': {
				next = { ...current, period: current.period === 'AM' ? 'PM' : 'AM' };
				break;
			}
		}

		this._updateValue(next);
	}

	/** Decrement the given segment value. */
	decrementSegment(segment: BrnTimeSegment): void {
		if (this.disabled()) return;
		const current = this.value();
		let next: BrnTimeValue;

		switch (segment) {
			case 'hours': {
				const h = current.hours <= 1 ? 12 : current.hours - 1;
				next = { ...current, hours: h };
				break;
			}
			case 'minutes': {
				const m = current.minutes <= 0 ? 59 : current.minutes - 1;
				next = { ...current, minutes: m };
				break;
			}
			case 'period': {
				next = { ...current, period: current.period === 'AM' ? 'PM' : 'AM' };
				break;
			}
		}

		this._updateValue(next);
	}

	/** Set a numeric digit for the active segment (for direct keyboard number entry). */
	setSegmentDigit(segment: BrnTimeSegment, digit: number): void {
		if (this.disabled()) return;
		const current = this.value();

		switch (segment) {
			case 'hours': {
				// Allow building a 2-digit number: if current entry would make sense, combine
				const combined = (current.hours % 10) * 10 + digit;
				const h = combined >= 1 && combined <= 12 ? combined : digit === 0 ? 10 : digit;
				this._updateValue({ ...current, hours: h });
				break;
			}
			case 'minutes': {
				const combined = (current.minutes % 10) * 10 + digit;
				const m = combined <= 59 ? combined : digit;
				this._updateValue({ ...current, minutes: m });
				break;
			}
			case 'period': {
				// 'a' key -> AM, 'p' key -> PM — handled in segment directive
				break;
			}
		}
	}

	/** Set the period directly. */
	setPeriod(period: BrnTimePeriod): void {
		if (this.disabled()) return;
		this._updateValue({ ...this.value(), period });
	}

	markAsTouched(): void {
		this._onTouched();
	}

	private _updateValue(value: BrnTimeValue): void {
		this.value.set(value);
		this._onChange(value);
		this.timeChange.emit(value);
	}
}
