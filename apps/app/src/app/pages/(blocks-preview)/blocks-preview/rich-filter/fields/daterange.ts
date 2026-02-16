import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideCalendar, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports, HlmPopoverTrigger } from '@spartan-ng/helm/popover';
import { RangeOperators } from '../engine/operators';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { DatePipe } from '@angular/common';
import { RICH_FILTER_MODEL } from '../engine/token';
import { BaseFilterField } from './utils/base-field';

@Component({
	selector: 'spartan-rich-filter-daterange-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgIcon,
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmPopoverImports,
		HlmCalendarImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
		DatePipe,
	],
	providers: [provideIcons({ lucideCalendar, lucideX })],
	host: {},
	template: `
		<hlm-popover sideOffset="5" align="end">
			<div
				hlmButtonGroup
				class="[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
			>
				<!-- label -->
				<spartan-rich-filter-field-label  [for]="labelFor()" [label]="label()" />
				<!-- operator dropdown -->
				<spartan-rich-filter-field-operator  [fieldId]="id()" [operators]="operators" />

				<!-- popover with range calendar -->
				<button hlmPopoverTrigger hlmBtn variant="outline" #dateRangeTrigger>
					<ng-icon hlm name="lucideCalendar" size="sm" />
					{{ startDate() | date: 'MMM d' }} - {{ endDate() | date: 'MMM d' }}
				</button>
				<hlm-popover-content class="w-auto rounded-xl p-0" *hlmPopoverPortal="let ctx">
					@let opts = options();
					<hlm-calendar-range
						[min]="opts.min"
						[max]="opts.max"
						[startDate]="startDate()"
						(startDateChange)="updateStartDate($event)"
						[endDate]="endDate()"
						(endDateChange)="updateEndDate($event)"
					/>
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close  [fieldId]="id()" />
			</div>
		</hlm-popover>
	`,
})
export class DateRangeField extends BaseFilterField<{ start: Date; end: Date } | null> {

	private readonly popoverBtn = viewChild<ElementRef<HTMLButtonElement>>('dateRangeTrigger');

	readonly operators = RangeOperators;


	readonly options = computed(() => this.engine.fieldMinMax(this.id()));

	readonly startDate = computed(() => this.controlValue()?.start ?? new Date());
	readonly endDate = computed(() => this.controlValue()?.end ?? new Date());

	private readonly _tempStart = signal<Date | null>(null);

	// update start date should not trigger a change in the model
	// until both start and end date are selected,
	protected updateStartDate(date: Date) {
		this._tempStart.set(date);
	}

	protected updateEndDate(date: Date) {
		const start = this._tempStart();
		if (!start || !date) {
			return;
		}

		this.engine.patchFieldValue(this.id(), { start, end: date });
		this._tempStart.set(null);

		// close popover after selecting range;
		// wrapped in promise to let change detection settle
		Promise.resolve().then(() => {
			this.popoverBtn()?.nativeElement.click();
		});
		// TODO: Does BrainPopoverTrigger expose a method to close the popover programmatically?
	}
}
