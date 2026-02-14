import { ChangeDetectionStrategy, Component, computed, forwardRef, input, model, output } from '@angular/core';
import type { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/helm/utils';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { BrnTimeInput, BrnTimeInputSegment, type BrnTimePeriod, type BrnTimeValue } from '@spartan-ng/brain/time-input';
import { HlmTimeInputSegment } from './hlm-time-input-segment';

const HLM_TIME_INPUT_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmTimeInput),
	multi: true,
};

@Component({
	selector: 'hlm-time-input',
	imports: [BrnTimeInput, BrnTimeInputSegment, HlmTimeInputSegment],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [HLM_TIME_INPUT_VALUE_ACCESSOR],
	host: {
		'data-slot': 'time-input',
	},
	template: `
		<brn-time-input
			[class]="_computedClass()"
			[value]="value()"
			[disabled]="disabled()"
			(timeChange)="_onTimeChange($event)"
		>
			<brn-time-input-segment hlm segment="hours" />
			<span class="text-muted-foreground" aria-hidden="true">:</span>
			<brn-time-input-segment hlm segment="minutes" />
			@if(displaySeconds()){<span class="text-muted-foreground" aria-hidden="true">:</span>
			<brn-time-input-segment hlm segment="seconds" />}
			<brn-time-input-segment hlm segment="period" />
		</brn-time-input>
	`,
})
export class HlmTimeInput implements ControlValueAccessor {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	readonly displaySeconds = input(false);

	readonly value = model<BrnTimeValue>({ hours: 12, minutes: 0, seconds: 0, period: 'AM' });
	readonly disabled = model(false);
	readonly timeChange = output<BrnTimeValue>();

	protected readonly _computedClass = computed(() =>
		hlm(
			'border-input bg-background inline-flex h-9 items-center gap-0.5 rounded-md border px-3 text-sm shadow-xs',
			'focus-within:ring-ring/50 focus-within:ring-2 focus-within:outline-none',
			'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
			this.userClass(),
		),
	);

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

	protected _onTimeChange(value: BrnTimeValue): void {
		this.value.set(value);
		this._onChange(value);
		this.timeChange.emit(value);
		this._onTouched();
	}
}
