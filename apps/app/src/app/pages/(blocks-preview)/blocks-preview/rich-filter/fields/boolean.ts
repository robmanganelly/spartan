import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { FilterModelRef } from '../engine/builders';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';

@Component({
	selector: 'spartan-rich-filter-boolean-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmInputImports,
		HlmCheckboxImports,
		FieldClose,
		FieldLabel,
	],
	host: {},
	template: `
		<div
			hlmButtonGroup
			class="[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
		>
			<!-- label -->
			<spartan-rich-filter-field-label [label]="label()" [for]="controlId()" />
			<!-- operator dropdown -->

			<!-- boolean input -->
			<div hlmButtonGroupSeparator></div>

			<div hlmButtonGroupText class="dark:bg-input/30 bg-transparent">
				<hlm-checkbox [id]="controlId()" [checked]="controlValue()" (checkedChange)="updateControl($event)" />
			</div>
			<!-- close button -->
			<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()"></spartan-rich-filter-field-close>
		</div>
	`,
})
export class BooleanField {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly controlId = computed(() => 'boolean-' + this.id());

	readonly label = computed(() => this.state().fieldLabel(this.id()));

	readonly controlValue = computed(() => this.state().fieldValue<boolean>(this.id()));

	protected updateControl(value: boolean) {
		this.state().patchFieldValue(this.id(), value);
	}
}
