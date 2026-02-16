import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTimeInputImports } from '@spartan-ng/helm/time-input';
import { TimeOperators } from '../engine/operators';
import { RICH_FILTER_MODEL } from '../engine/token';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { BaseFilterField } from './utils/base-field';

@Component({
	selector: 'spartan-rich-filter-time-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmTimeInputImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
	],
	providers: [provideIcons({ lucideLink2, lucideX })],
	host: {},
	template: `
		<div
			hlmButtonGroup
			class="[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
		>
			<!-- label -->
			<spartan-rich-filter-field-label [for]="labelFor()" [label]="label()" />
			<!-- operator dropdown -->
			<spartan-rich-filter-field-operator [fieldId]="id()" [operators]="operators" />

			<!-- time input -->
			<hlm-time-input
				[displaySeconds]="true"
				class="dark:bg-input/30 rounded-none border-l-0 bg-transparent shadow-none"
				[value]="controlValueTime()"
				(valueChange)="updateControlValue($event)"
			/>

			<!-- close button -->
			<spartan-rich-filter-field-close [fieldId]="id()" />
		</div>
	`,
})
export class TimeField extends BaseFilterField<Date> {


	readonly controlId = computed(() => 'time-' + this.id());


	readonly operators = TimeOperators;

	readonly controlValueTime = computed(() => {
		const d = this.engine.fieldValue<Date>(this.id()) ?? new Date();
		let hours = d.getHours();
		const minutes = d.getMinutes();
		const seconds = d.getSeconds();
		const period = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;
		return { hours, minutes, seconds, period: period as 'AM' | 'PM' };
	});

	protected updateControlValue(value: { hours: number; minutes: number; seconds: number; period: string }) {
		const d = new Date(this.engine.fieldValue<Date>(this.id()) ?? new Date());
		let hours = value.hours % 12;
		if (value.period === 'PM') hours += 12;
		d.setHours(hours, value.minutes, value.seconds, 0);
		this.engine.patchFieldValue(this.id(), d);
	}
}
