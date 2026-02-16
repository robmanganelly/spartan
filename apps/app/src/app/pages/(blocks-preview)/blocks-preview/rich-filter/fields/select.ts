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
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';

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
			<spartan-rich-filter-field-label [label]="label()" [for]="controlId()" />
			<!-- operator dropdown -->
			<spartan-rich-filter-field-operator [state]="state()" [fieldId]="id()" [operators]="operators" />

			<!-- select field with options -->
			<brn-select
				class="inline-block [&>div>hlm-select-trigger>button]:rounded-none [&>div>hlm-select-trigger>button]:border-l-0"
				placeholder="Select an option"
				[value]="controlValue()"
				(valueChange)="updateControlValue($event)"
			>
				<hlm-select-trigger>
					<hlm-select-value>
						<div *brnSelectValue="let value">
							<span>{{ optionMap().get(value) }}</span>
						</div>
					</hlm-select-value>
				</hlm-select-trigger>
				<hlm-select-content>
					@for (option of options(); track option.value) {
						<hlm-option [value]="option.value">{{ option.label }}</hlm-option>
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

	readonly controlId = computed(() => 'select-' + this.id());

	readonly label = computed(() => this.state().fieldLabel(this.id()));

	readonly operators = IdentityOperators;

	// TODO
	readonly options = computed(()=>this.state().fieldOptions(this.id()))

	readonly optionMap = computed(() => {
		const map = new Map();
		for (const option of this.options()) {
			map.set(option.value, option.label);
		}
		return map;
	})

	readonly controlValue = computed(() => this.state().fieldValue<string>(this.id()));

	protected updateControlValue(value: string | string[] | undefined) {
		if (value == null) return;
		this.state().patchFieldValue(this.id(), Array.isArray(value) ? value[0] : value);
	}
}
