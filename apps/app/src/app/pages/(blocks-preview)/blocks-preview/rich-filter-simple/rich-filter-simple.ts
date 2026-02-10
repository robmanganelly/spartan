import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilterX, lucideListFilterPlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { FilterModelRef } from './engine/builders';
import { FieldTypes } from './engine/types';
import { BooleanField } from './fields/boolean';
import { NumberField } from './fields/number';
import { TextField } from './fields/text';
import { RangeField } from "./fields/range";

@Component({
	selector: 'spartan-simple-rich-filter',
	imports: [HlmButtonImports, NgIcon, HlmIconImports, TextField, NumberField, BooleanField, RangeField],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [provideIcons({ lucideFilterX, lucideListFilterPlus })],
	template: `
		<div class="flex w-full gap-2">
			<div class="flex flex-1 flex-wrap gap-2">
				<button hlmBtn>
					<ng-icon size="sm" hlm name="lucideListFilterPlus" />
					Add Filter
				</button>
				<!--inputs will be shown here  -->
				@for (e of state().fieldsArray(); track e.id) {
					@switch (e.type) {
						@case (types.text) {
							<spartan-rich-filter-text-field [label]="e.id"></spartan-rich-filter-text-field>
						}
						@case (types.number) {
							<spartan-rich-filter-number-field [label]="e.id"></spartan-rich-filter-number-field>
						}
						@case (types.boolean) {
							<spartan-rich-filter-boolean-field [label]="e.id"></spartan-rich-filter-boolean-field>
						}
						@case (types.range) {
							<spartan-rich-filter-range-field [label]="e.id"></spartan-rich-filter-range-field>
						}
						@default {
							<span>not yet implemented: {{ e.id }} : {{ e.type }}</span>
						}
					}
				}
			</div>

			<button hlmBtn>
				<ng-icon size="sm" hlm name="lucideFilterX" />
				Clear
			</button>
		</div>
	`,
})
export class RichFilterSimple {
	readonly state = input.required<FilterModelRef>();

	readonly types = FieldTypes;
}
