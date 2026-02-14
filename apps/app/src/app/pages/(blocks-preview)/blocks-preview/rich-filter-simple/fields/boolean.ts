import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FilterModelRef } from '../engine/builders';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { IdentityOperators } from '../engine/operators';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { FieldClose } from "../utils/field-close";
import { FieldLabel } from '../utils/field-label';

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
			<spartan-rich-filter-field-label [label]="id()" [for]="fieldLabel()" />
			<!-- operator dropdown -->

			<!-- boolean input -->
			<div hlmButtonGroupSeparator ></div>

			<div hlmButtonGroupText class="bg-transparent dark:bg-input/30">
				<hlm-checkbox [id]="fieldLabel()" />
			</div>
			<!-- close button -->
			<!-- <button hlmBtn variant="outline" size="icon">
				<ng-icon name="lucideX" />
			</button> -->
			<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()"></spartan-rich-filter-field-close>
		</div>
	`,
})
export class BooleanField {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'boolean-' + this.id());

}
