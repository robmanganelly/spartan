import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { EqualityOperators } from '../engine/operators';
import { FieldClose } from '../utils/field-close';
import { FieldLabel } from '../utils/field-label';

@Component({
	selector: 'spartan-rich-filter-number-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmInputImports,
		BrnSelectImports,
		HlmSelectImports,
		FieldClose,
		FieldLabel,
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

			<brn-select class="inline-block" placeholder="Select an option" [value]="operators[0].value">
				<hlm-select-trigger>
					<hlm-select-value>
						<div *brnSelectValue="let value">
							<span>{{ value }}</span>
						</div>
					</hlm-select-value>
				</hlm-select-trigger>
				<hlm-select-content class="!min-w-40">
					@for (operator of operators; track operator.key) {
						<hlm-option [value]="operator.value">
							<span>
								{{ operator.value }}
							</span>
							<span class="text-muted-foreground">{{ operator.key }}</span>
						</hlm-option>
					}
				</hlm-select-content>
			</brn-select>

			<!-- numeric input -->
			<input class="w-28" hlmInput [id]="fieldLabel()" type="number"/>
			<!-- close button -->
			<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
		</div>
	`,
})
export class NumberField {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'number-' + this.id());

	readonly operators = Object.entries(EqualityOperators).map(([key, value]) => ({ key, value }));
}
