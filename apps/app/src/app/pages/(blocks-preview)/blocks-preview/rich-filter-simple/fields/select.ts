import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmRangeSliderImports } from '@spartan-ng/helm/range-slider';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { IdentityOperators } from '../engine/operators';
import { FieldClose } from '../utils/field-close';
import { FieldLabel } from '../utils/field-label';
import { FieldOperator } from '../utils/field-operator';

@Component({
	selector: 'spartan-rich-filter-select-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		// HlmInputImports,
		BrnSelectImports,
		HlmSelectImports,
		HlmPopoverImports,
		HlmRangeSliderImports,
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

			<!-- select field with options -->
			<brn-select class="inline-block [&>div>hlm-select-trigger>button]:rounded-none [&>div>hlm-select-trigger>button]:border-l-0" placeholder="Select an option" [value]="null">
				<hlm-select-trigger>
					<hlm-select-value>
						<div *brnSelectValue="let value">
							<span>{{ _keyByValue(value) }}</span>
						</div>
					</hlm-select-value>
				</hlm-select-trigger>
				<hlm-select-content>
					@for (option of options; track option.value) {
						<hlm-option [value]="option.value">{{ option.key }}</hlm-option>
					}
				</hlm-select-content>
			</brn-select>

			<!-- close button -->
			<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
		</div>
	`,
})
export class SelectField {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'select-' + this.id());

	readonly operators = IdentityOperators;

	// TODO
	readonly options = [
		{ key: 'O1', value: 'option1' },
		{ key: 'Option 2', value: 'option2' },
		{ key: 'Option 3', value: 'option3' },
		{ key: 'Option 4 a bit longer now it seems', value: 'option4' },
	];

	// todo make this more efficient with a map
	protected _keyByValue(value: string): string {
		return this.options.find((o) => o.value === value)?.key ?? value;
	}
}
