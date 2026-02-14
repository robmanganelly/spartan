import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmRangeSliderImports } from '@spartan-ng/helm/range-slider';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { IdentityOperators } from '../engine/operators';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

@Component({
	selector: 'spartan-rich-filter-combo-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgIcon,
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmLabelImports,
		HlmIconImports,
		HlmButtonImports,
		// HlmInputImports,
		BrnSelectImports,
		HlmSelectImports,
		HlmPopoverImports,
		HlmRangeSliderImports,
		HlmComboboxImports,
	],
	providers: [provideIcons({ lucideLink2, lucideX })],
	host: {},
	template: `
		<div
			hlmButtonGroup
			class="
			[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none
			[&>brn-select>div>hlm-select-trigger>button]:rounded-r-none
			[&_hlm-input-group]:!rounded-none
			"
		>
			<!-- label -->
			<div hlmButtonGroupText>
				<label class="w-content" hlmLabel [for]="fieldLabel()">{{ id() }}</label>
			</div>
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

			<!-- select field with options -->
			<hlm-combobox>
				<hlm-combobox-input placeholder="Select a framework" class="rounded-l-none rounded-r-none" />
				<hlm-combobox-content *hlmComboboxPortal>
					<hlm-combobox-empty>No items found.</hlm-combobox-empty>
					<div hlmComboboxList>
						@for (framework of options; track $index) {
							<hlm-combobox-item [value]="framework">{{ framework.label }}</hlm-combobox-item>
						}
					</div>
				</hlm-combobox-content>
			</hlm-combobox>

			<!-- close button -->
			<button hlmBtn variant="outline" size="icon">
				<ng-icon name="lucideX" />
			</button>
		</div>
	`,
})
export class ComboField {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'boolean-' + this.id());

	readonly operators = Object.entries(IdentityOperators).map(([key, value]) => ({ key, value }));

	// TODO
	readonly options = [
		{ label: 'Option 1', value: 'option1' },
		{ label: 'Option 2', value: 'option2' },
		{ label: 'Option 3', value: 'option3' },
		{ label: 'Option 4 a bit longer now it seems', value: 'option4' },
	];

	// todo make this more efficient with a map
	protected _keyByValue(value: string): string {
		return this.options.find((o) => o.value === value)?.label ?? value;
	}
}
