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
import { RangeOperators } from '../engine/operators';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';

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
				<button hlmPopoverTrigger hlmBtn variant="outline">
					<ng-icon hlm name="lucideCalendar" size="sm" />
					{{ _displayRange() }}
				</button>
				<hlm-popover-content class="w-auto rounded-xl p-0" *hlmPopoverPortal="let ctx">
					<hlm-calendar-range [(startDate)]="startDate" [(endDate)]="endDate" />
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
			</div>
		</hlm-popover>
	`,
})
export class DateRangeField {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'daterange-' + this.id());

	readonly operators = RangeOperators;

	readonly startDate = signal<Date | undefined>(undefined);
	readonly endDate = signal<Date | undefined>(undefined);

	protected readonly _displayRange = computed(() => {
		const start = this.startDate();
		const end = this.endDate();
		const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

		if (!start && !end) return 'Pick dates';
		if (start && !end) return fmt(start) + ' – …';
		if (start && end) return fmt(start) + ' – ' + fmt(end);
		return 'Pick dates';
	});
}
