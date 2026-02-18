import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTimeInputImports } from '@spartan-ng/helm/time-input';
import { TimeOperators } from '../engine/operators';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FHandler } from '../engine/handlers';
import { FILTER_HANDLER } from '../engine/token';
import { FieldTypes } from '../engine/types';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FocusElementOptions } from './utils/focus-element';
import { FAKE_FOCUS_ORIGIN } from '../engine/constants';

@Component({
	selector: 'spartan-rich-filter-time-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmTimeInputImports,
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

			<!-- time input -->
			<hlm-time-input
				#monitoredInput
				[displaySeconds]="true"
				class="dark:bg-input/30 rounded-none border-l-0 bg-transparent shadow-none"
				[value]="service.controlValue()"
				(valueChange)="service.updateControl($event)"
			/>

			<!-- close button -->
			<spartan-rich-filter-field-close (onCloseField)="service.closeField()" />
		</div>
	`,
})
export class TimeField implements FocusElementOptions {
	protected readonly service = inject(FILTER_HANDLER) as FHandler<typeof FieldTypes.time>;

	readonly focusMonitor = inject(FocusMonitor);

	readonly monitoredInput = viewChild.required('monitoredInput', { read: ElementRef<HTMLElement> });

	readonly operators = TimeOperators;

	readonly onFocusElement = effect(() => {
		this.service.isFocused() && this.focusMonitor.focusVia(this.monitoredInput(), FAKE_FOCUS_ORIGIN);
	});
}
