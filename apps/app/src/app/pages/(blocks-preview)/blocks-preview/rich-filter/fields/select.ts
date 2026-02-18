import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';

import { FocusMonitor } from '@angular/cdk/a11y';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmRangeSliderImports } from '@spartan-ng/helm/range-slider';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { FHandler } from '../engine/handlers';
import { IdentityOperators } from '../engine/operators';
import { FILTER_HANDLER } from '../engine/token';
import { FieldTypes } from '../engine/types';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FocusElementOptions } from './utils/focus-element';
import { FAKE_FOCUS_ORIGIN } from '../engine/constants';

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
			<spartan-rich-filter-field-label [label]="service.controlLabel()" [for]="service.formId()" />
			<!-- operator dropdown -->
			<spartan-rich-filter-field-operator
				[operatorValue]="service.operatorValue()"
				(operatorValueChange)="service.setOperator($event)"
				[operators]="operators"
			/>

			<!-- select field with options -->
			<brn-select
				class="inline-block [&>div>hlm-select-trigger>button]:rounded-none [&>div>hlm-select-trigger>button]:border-l-0"
				placeholder="Select an option"
				[value]="service.controlValue()"
				(valueChange)="service.updateControl($event)"
				#monitoredInput
			>
				<hlm-select-trigger>
					<hlm-select-value>
						<div *brnSelectValue="let value">
							<span>{{ service.selectedOptionLabel() }}</span>
						</div>
					</hlm-select-value>
				</hlm-select-trigger>
				<hlm-select-content>
					@for (option of service.options(); track option.value) {
						<hlm-option [value]="option.value">{{ option.label }}</hlm-option>
					}
				</hlm-select-content>
			</brn-select>

			<!-- close button -->
			<spartan-rich-filter-field-close (onCloseField)="service.closeField()" />
		</div>
	`,
})
export class SelectField implements FocusElementOptions {
	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.select>;

	readonly operators = IdentityOperators;
	readonly focusMonitor = inject(FocusMonitor);

	readonly monitoredInput = viewChild.required('monitoredInput', { read: ElementRef<HTMLElement> });

	readonly onFocusElement = effect(() => {
		this.service.isFocused() && this.focusMonitor.focusVia(this.monitoredInput(), FAKE_FOCUS_ORIGIN);
	});
}
