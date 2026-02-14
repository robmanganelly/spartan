import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideCalendar, lucideX } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { RangeOperators } from '../engine/operators';
import { FieldClose } from '../utils/field-close';

@Component({
	selector: 'spartan-rich-filter-daterange-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgIcon,
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmLabelImports,
		HlmIconImports,
		HlmButtonImports,
		BrnSelectImports,
		HlmSelectImports,
		HlmPopoverImports,
		HlmCalendarImports,
		FieldClose,
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
				<div hlmButtonGroupText>
					<label class="w-content" hlmLabel [for]="fieldLabel()">{{ id() }}</label>
				</div>
				<!-- operator dropdown -->

				<brn-select class="inline-block" placeholder="Select an option" [value]="operators[0].value">
					<hlm-select-trigger>
						<hlm-select-value>
							<div *brnSelectValue="let value">
								<span>{{ value }}</span>
							</div>
						</hlm-select-value>
					</hlm-select-trigger>
					<hlm-select-content class="!min-w-40">
						@for (operator of operators; track operator.key) {
							<hlm-option [value]="operator.value">
								<span>
									{{ operator.value }}
								</span>
								<span class="text-muted-foreground">{{ operator.key }}</span>
							</hlm-option>
						}
					</hlm-select-content>
				</brn-select>

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

	readonly operators = Object.entries(RangeOperators).map(([key, value]) => ({ key, value }));

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
