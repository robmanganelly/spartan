import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilterX, lucideListFilterPlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { FilterModelRef } from './engine/builders';
import { FieldTypes } from './engine/types';
import { BooleanField } from './fields/boolean';
import { DateField } from './fields/date';
import { DateRangeField } from './fields/daterange';
import { NumberField } from './fields/number';
import { TextField } from './fields/text';
import { TimeField } from './fields/time';
import { RangeField } from "./fields/range";
import { SelectField } from "./fields/select";
import { ComboField } from "./fields/combo";

@Component({
	selector: 'spartan-simple-rich-filter',
	imports: [HlmButtonImports, NgIcon, HlmIconImports, HlmDropdownMenuImports, TextField, NumberField, BooleanField, RangeField, TimeField, DateField, DateRangeField, SelectField, ComboField],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [provideIcons({ lucideFilterX, lucideListFilterPlus })],
	template: `
		@let filter = state();
		<div class="flex w-full gap-2">
			<div class="flex flex-1 flex-wrap gap-2">
			@let remaining = filter.availableFields();
			@if(remaining.length){<button hlmBtn [hlmDropdownMenuTrigger]="addFilterMenu" align="start">
					<ng-icon size="sm" hlm name="lucideListFilterPlus" />
					Add Filter
				</button>
				<ng-template #addFilterMenu>
					<hlm-dropdown-menu class="w-48">
						<hlm-dropdown-menu-group>
							@for (field of remaining; track field.id) {
								<button hlmDropdownMenuItem (click)="filter.addField(field.id)">
									<span>{{ field.id }}</span>
								</button>
							} @empty {
								<div class="text-muted-foreground px-2 py-1.5 text-sm">No more filters</div>
							}
						</hlm-dropdown-menu-group>
					</hlm-dropdown-menu>
				</ng-template>}
				<!--inputs will be shown here  -->
				@for (e of filter.fieldsArray(); track e.id) {
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
						@case (types.time) {
							<spartan-rich-filter-time-field [label]="e.id"></spartan-rich-filter-time-field>
						}
						@case (types.date) {
							<spartan-rich-filter-date-field [label]="e.id"></spartan-rich-filter-date-field>
						}
						@case (types.daterange) {
							<spartan-rich-filter-daterange-field [label]="e.id"></spartan-rich-filter-daterange-field>
						}
						@case (types.select) {
							<spartan-rich-filter-select-field [label]="e.id"></spartan-rich-filter-select-field>
						}
						@case (types.combobox) {
							<spartan-rich-filter-combo-field [label]="e.id"></spartan-rich-filter-combo-field>
						}
						<!-- @default {
							<span>not yet implemented : {{ e.id }} : {{ e.type }}</span>
						} -->
					}
				}
			</div>

			<button hlmBtn (click)="filter.clear()">
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
