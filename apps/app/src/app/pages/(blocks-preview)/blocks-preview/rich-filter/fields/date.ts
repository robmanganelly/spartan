import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { TimeOperators } from '../engine/operators';
import { BaseFilterField } from './utils/base-field';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';

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
				<spartan-rich-filter-field-label [for]="labelFor()" [label]="label()" />
				<!-- operator dropdown -->
				<spartan-rich-filter-field-operator [fieldId]="id()" [operators]="operators" />

				<!-- popover with calendar -->
				<button hlmPopoverTrigger hlmBtn variant="outline" #dateTrigger>
					<ng-icon hlm name="lucideCalendar" size="sm" />
					{{ value | date: 'mediumDate' }}
				</button>
				<hlm-popover-content class="w-auto rounded-xl p-0" *hlmPopoverPortal="let ctx">
					@let opts = options();
					<hlm-calendar [min]="opts.min" [max]="opts.max" [date]="value" (dateChange)="updateControl($event)" />
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close [fieldId]="id()" />
			</div>
		</hlm-popover>
	`,
})
export class DateField extends BaseFilterField<Date> {
	private popoverBtn = viewChild<ElementRef<HTMLButtonElement>>('dateTrigger');

	readonly controlId = computed(() => 'date-' + this.id());

	readonly operators = TimeOperators;

	readonly options = computed(() => this.engine.fieldMinMax(this.id()));

	protected override afterUpdate = () => {
		this.popoverBtn()?.nativeElement.click();
	};
}
