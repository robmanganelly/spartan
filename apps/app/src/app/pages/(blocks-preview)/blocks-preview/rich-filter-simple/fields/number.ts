import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { EqualityOperators } from '../engine/operators';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'spartan-rich-filter-number-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmInputImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
		// todo replace with signals form as soon as spartan supports them
		FormsModule,
	],
	providers: [provideIcons({ lucideLink2, lucideX })],
	host: {},
	template: `
		<div
			hlmButtonGroup
			class="[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
		>
			<!-- label -->
			<spartan-rich-filter-field-label [label]="id()" [for]="fieldLabel()" />
			<!-- operator dropdown -->
			<spartan-rich-filter-field-operator [state]="state()" [fieldId]="id()" [operators]="operators" />

			<!-- numeric input -->
			<input
				class="w-28"
				hlmInput
				[id]="fieldLabel()"
				type="number"
				[ngModel]="controlValue()"
				(ngModelChange)="updateControlValue($event)"
			/>
			<!-- close button -->
			<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
		</div>
	`,
})
export class NumberField {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'number-' + this.id());

	readonly operators = EqualityOperators;

	readonly controlValue = computed(() => this.state().fieldValue<number>(this.id()) ?? 0);

	protected updateControlValue(event: string) {
		// html input of type number returns string, so we need to convert it to number
		this.state().patchFieldValue(this.id(), +event);
	}
}
