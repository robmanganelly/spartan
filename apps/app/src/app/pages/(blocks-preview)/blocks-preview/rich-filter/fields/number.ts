import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
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
import { RICH_FILTER_MODEL } from '../engine/token';
import { BaseFilterField } from './utils/base-field';

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
			<spartan-rich-filter-field-label  [for]="labelFor()" [label]="label()" />
			<!-- operator dropdown -->
			<spartan-rich-filter-field-operator  [fieldId]="id()" [operators]="operators" />

			<!-- numeric input -->
			<input
				class="w-28"
				hlmInput
				[id]="controlId()"
				type="number"
				[ngModel]="controlValue()"
				(ngModelChange)="updateControl($event)"
				[min]="options().min"
				[max]="options().max"
				[step]="options().step"
			/>
			<!-- close button -->
			<spartan-rich-filter-field-close  [fieldId]="id()" />
		</div>
	`,
})
export class NumberField extends BaseFilterField<number> {



	readonly controlId = computed(() => 'number-' + this.id());


	readonly operators = EqualityOperators;


	readonly options = computed(() => this.engine.fieldNumericOptions(this.id()));

}
