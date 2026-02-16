import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmRangeSliderImports } from '@spartan-ng/helm/range-slider';
import { IdentityOperators } from '../engine/operators';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FormsModule } from '@angular/forms';
import { RICH_FILTER_MODEL } from '../engine/token';

@Component({
	selector: 'spartan-rich-filter-combo-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		// HlmInputImports,
		HlmPopoverImports,
		HlmRangeSliderImports,
		HlmComboboxImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
		// TODO replace with signals form as soon as spartan supports them
		FormsModule,
	],
	providers: [provideIcons({ lucideLink2, lucideX })],
	host: {},
	template: `
		<div
			hlmButtonGroup
			class="[&_hlm-input-group]:!rounded-none [&_hlm-input-group]:!border-l-0 [&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
		>
			<!-- label -->
			<spartan-rich-filter-field-label [label]="label()" [for]="controlId()" />
			<!-- operator dropdown -->
			<spartan-rich-filter-field-operator [state]="state()" [fieldId]="id()" [operators]="operators" />

			<!-- select field with options -->
			<hlm-combobox [ngModel]="controlValue()" (ngModelChange)="updateControlValue($event)">
				<hlm-combobox-input [placeholder]="placeholder()" class="rounded-none border-l-0" />
				<hlm-combobox-content *hlmComboboxPortal>
					<hlm-combobox-empty>No items found.</hlm-combobox-empty>
					<div hlmComboboxList>
						@for (framework of options(); track $index) {
							<hlm-combobox-item [value]="framework">{{ framework.label }}</hlm-combobox-item>
						}
					</div>
				</hlm-combobox-content>
			</hlm-combobox>

			<!-- close button -->
			<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
		</div>
	`,
})
export class ComboField {
	private readonly engine = inject(RICH_FILTER_MODEL);

	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly controlId = computed(() => 'combo-' + this.id());

	readonly label = computed(() => this.state().fieldLabel(this.id()));

	readonly operators = IdentityOperators;

	readonly controlValue = computed(() => this.state().fieldValue(this.id()));

	readonly placeholder = computed(() => this.state().fieldPlaceholder(this.id()));

	protected updateControlValue(value: string) {
		this.state().patchFieldValue(this.id(), value);
	}

	readonly options = computed(() => this.state().fieldOptions(this.id()) ?? []);
}
