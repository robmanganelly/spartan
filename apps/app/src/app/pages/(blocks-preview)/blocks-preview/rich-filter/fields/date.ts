import { ChangeDetectionStrategy, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideCalendar, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { TimeOperators } from '../engine/operators';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'spartan-rich-filter-date-field',
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
		@let value = controlValue();
		<hlm-popover sideOffset="5" align="end">
			<div
				hlmButtonGroup
				class="[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
			>
				<!-- label -->
				<spartan-rich-filter-field-label [label]="id()" [for]="fieldLabel()" />
				<!-- operator dropdown -->
				<spartan-rich-filter-field-operator [state]="state()" [fieldId]="id()" [operators]="operators" />

				<!-- popover with calendar -->
				<button hlmPopoverTrigger hlmBtn variant="outline" #dateTrigger>
					<ng-icon hlm name="lucideCalendar" size="sm" />
					{{ value | date: 'mediumDate' }}
				</button>
				<hlm-popover-content class="w-auto rounded-xl p-0" *hlmPopoverPortal="let ctx">
					@let opts = options();
					<hlm-calendar
					[min]="opts.min"
					[max]="opts.max"
					[date]="value" (dateChange)="updateControlValue($event)" />
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
			</div>
		</hlm-popover>
	`,
})
export class DateField {

	private popoverBtn = viewChild<ElementRef<HTMLButtonElement>>('dateTrigger');

	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'date-' + this.id());

	readonly operators = TimeOperators;

	readonly controlValue = computed(() => this.state().fieldValue<Date>(this.id()) ?? new Date());

	readonly options = computed(() => this.state().fieldMinMax(this.id()));

	updateControlValue(value: Date | null) {
		this.state().patchFieldValue(this.id(), value);

		// close popover after selecting range;
		// wrapped in promise to let change detection settle
		Promise.resolve().then(() => {
			this.popoverBtn()?.nativeElement.click();
		});
	}
}
