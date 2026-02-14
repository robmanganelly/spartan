import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { TextOperators } from '../engine/operators';
import { FieldClose } from '../utils/field-close';
import { FieldLabel } from '../utils/field-label';
import { FieldOperator } from '../utils/field-operator';

@Component({
	selector: 'spartan-rich-filter-text-field',
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
			<spartan-rich-filter-field-operator [operators]="operators" />

			<!-- text input -->
			<input class="w-40" hlmInput [id]="fieldLabel()" />
			<!-- close button -->
			<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
		</div>
	`,
})
export class TextField {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'text-' + this.id());

	readonly operators = TextOperators;
}
