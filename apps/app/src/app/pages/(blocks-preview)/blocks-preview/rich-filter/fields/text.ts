import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { TextOperators } from '../engine/operators';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FormsModule } from '@angular/forms';
import { RICH_FILTER_MODEL } from '../engine/token';

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
			<spartan-rich-filter-field-label  [for]="controlId()" />
			<!-- operator dropdown -->
			<spartan-rich-filter-field-operator  [fieldId]="id()" [operators]="operators" />

			<!-- text input -->
			<input
				class="w-40"
				hlmInput
				[id]="controlId()"
				[ngModel]="controlValue()"
				(ngModelChange)="updateControlValue($event)"
				[required]="fieldRequired()"
			/>
			<!-- close button -->
			<spartan-rich-filter-field-close  [fieldId]="id()" />
		</div>
	`,
})
export class TextField {
	private readonly engine = inject(RICH_FILTER_MODEL);

	readonly id = input.required<string>();

	readonly controlId = computed(() => 'text-' + this.id());

	readonly label = computed(() => this.engine.fieldLabel(this.id()));

	readonly operators = TextOperators;

	readonly controlValue = computed(() => this.engine.fieldValue<string>(this.id()) ?? '');

	readonly fieldRequired = computed(() => this.engine.fieldRequired(this.id()));

	protected updateControlValue(value: string) {
		this.engine.patchFieldValue(this.id(), value);
	}
}
