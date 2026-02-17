import { ChangeDetectionStrategy, Component, computed, Inject, inject, input } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FHandler, FIELD_HANDLERS_MAP } from '../engine/handlers';
import { FieldTypes } from '../engine/types';
import { FILTER_HANDLER } from '../engine/token';

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
			<spartan-rich-filter-field-label [label]="service.formId()" [for]="service.controlLabel()" />
			<!-- operator dropdown -->

			<!-- boolean input -->
			<div hlmButtonGroupSeparator></div>

			<div hlmButtonGroupText class="dark:bg-input/30 bg-transparent">
				<hlm-checkbox [id]="service.formId()" [checked]="service.controlValue()" (checkedChange)="service.updateControl($event)" />
			</div>
			<!-- close button -->
			<spartan-rich-filter-field-close (onCloseField)="service.closeField()" ></spartan-rich-filter-field-close>
		</div>
	`,
})
export class BooleanField {

	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.boolean>;

}
