import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { RICH_FILTER_MODEL } from '../engine/token';
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
			<spartan-rich-filter-field-label [for]="controlId()" />
			<!-- operator dropdown -->

			<!-- boolean input -->
			<div hlmButtonGroupSeparator></div>

			<div hlmButtonGroupText class="dark:bg-input/30 bg-transparent">
				<hlm-checkbox [id]="controlId()" [checked]="controlValue()" (checkedChange)="updateControl($event)" />
			</div>
			<!-- close button -->
			<spartan-rich-filter-field-close [fieldId]="id()"></spartan-rich-filter-field-close>
		</div>
	`,
})
export class BooleanField {
	private readonly engine = inject(RICH_FILTER_MODEL);

	readonly id = input.required<string>();

	readonly controlId = computed(() => 'boolean-' + this.id());

	readonly controlValue = computed(() => this.engine.fieldValue<boolean>(this.id()));

	protected updateControl(value: boolean) {
		this.engine.patchFieldValue(this.id(), value);
	}
}
