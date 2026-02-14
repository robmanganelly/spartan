import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
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
import { FieldClose } from '../utils/field-close';
import { FieldLabel } from '../utils/field-label';
import { FieldOperator } from '../utils/field-operator';

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

				<!-- popover with calendar -->
				<button hlmPopoverTrigger hlmBtn variant="outline">
					<ng-icon hlm name="lucideCalendar" size="sm" />
					{{ _displayDate() }}
				</button>
				<hlm-popover-content class="w-auto rounded-xl p-0" *hlmPopoverPortal="let ctx">
					<hlm-calendar [(date)]="selectedDate" />
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
			</div>
		</hlm-popover>
	`,
})
export class DateField {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'date-' + this.id());

	readonly operators = TimeOperators;

	readonly selectedDate = signal<Date | undefined>(undefined);

	protected readonly _displayDate = computed(() => {
		const d = this.selectedDate();
		if (!d) return 'Pick a date';
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	});
}
