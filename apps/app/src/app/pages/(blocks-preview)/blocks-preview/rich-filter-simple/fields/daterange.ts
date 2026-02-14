import { ChangeDetectionStrategy, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
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
				<spartan-rich-filter-field-label [label]="id()" [for]="fieldLabel()" />
				<!-- operator dropdown -->
				<spartan-rich-filter-field-operator [operators]="operators" />

				<!-- popover with range calendar -->
				<button hlmPopoverTrigger hlmBtn variant="outline" #popoverBtn>
					<ng-icon hlm name="lucideCalendar" size="sm" />
					{{ startDate() | date: 'MMM d' }} - {{ endDate() | date: 'MMM d' }}
				</button>
				<hlm-popover-content class="w-auto rounded-xl p-0" *hlmPopoverPortal="let ctx">
					<hlm-calendar-range
						[startDate]="startDate()"
						(startDateChange)="updateStartDate($event)"
						[endDate]="endDate()"
						(endDateChange)="updateEndDate($event)"
					/>
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
			</div>
		</hlm-popover>
	`,
})
export class DateRangeField {
	private readonly popoverBtn = viewChild<ElementRef<HTMLButtonElement>>('popoverBtn');

	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'daterange-' + this.id());

	readonly operators = RangeOperators;

	readonly controlValue = computed(() => this.state().fieldValue<{ start: Date; end: Date } | null>(this.id()));

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

		this.state().patchFieldValue(this.id(), { start, end: date });
		this._tempStart.set(null);

		// close popover after selecting range;
		// wrapped in promise to let change detection settle
		Promise.resolve().then(() => {
			this.popoverBtn()?.nativeElement.click()
		});
		// TODO: Does BrainPopoverTrigger expose a method to close the popover programmatically?
	}
}
