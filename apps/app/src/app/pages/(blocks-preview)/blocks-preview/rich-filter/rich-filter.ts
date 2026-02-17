import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Injector, model, Type } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFunnel, lucideFunnelPlus, lucideFunnelX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { FilterModelRef } from './engine/builders';
import { FIELD_HANDLERS_MAP } from './engine/handlers';
import { FILTER_HANDLER } from './engine/token';
import { FieldTypes, IFieldType } from './engine/types';
import { BooleanField } from './fields/boolean';
import { ComboField } from './fields/combo';
import { ComboAsyncField } from './fields/combo-async';
import { DateField } from './fields/date';
import { DateRangeField } from './fields/daterange';
import { NumberField } from './fields/number';
import { RangeField } from './fields/range';
import { SelectField } from './fields/select';
import { TextField } from './fields/text';
import { TimeField } from './fields/time';

/** Maps each field type to the component class that renders it. */
const FIELD_COMPONENT_MAP: Record<IFieldType, Type<unknown>> = {
	[FieldTypes.text]: TextField,
	[FieldTypes.number]: NumberField,
	[FieldTypes.boolean]: BooleanField,
	[FieldTypes.range]: RangeField,
	[FieldTypes.time]: TimeField,
	[FieldTypes.date]: DateField,
	[FieldTypes.daterange]: DateRangeField,
	[FieldTypes.select]: SelectField,
	[FieldTypes.combobox]: ComboField,
	[FieldTypes.asyncCombobox]: ComboAsyncField,
};

@Component({
	selector: 'spartan-rich-filter',
	imports: [HlmButtonImports, NgIcon, HlmIconImports, HlmDropdownMenuImports, NgComponentOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [provideIcons({ lucideFunnel, lucideFunnelX, lucideFunnelPlus })],
	template: `
		@let filter = state();
		<div class="flex w-full gap-2">
			<div class="flex flex-1 flex-wrap gap-2">
				@let remaining = filter.availableFields();
				@let active = fields();
				<!--inputs rendered programmatically  -->
				@for (field of active; track field.id) {
					<ng-container *ngComponentOutlet="field.component; injector: field.injector" />
				}
				<!-- button comes after -->
				@if (remaining.length) {
					<button size="icon" hlmBtn [hlmDropdownMenuTrigger]="addFilterMenu" align="start">
						<ng-icon size="sm" hlm [name]="active.length ? 'lucideFunnelPlus' : 'lucideFunnel'" />
					</button>
					<ng-template #addFilterMenu>
						<hlm-dropdown-menu class="w-48">
							<hlm-dropdown-menu-group>
								@for (field of remaining; track field.id) {
									<button hlmDropdownMenuItem (click)="filter.addField(field.id)">
										<span>{{ field.__label ?? field.id }}</span>
									</button>
								} @empty {
									<div class="text-muted-foreground px-2 py-1.5 text-sm">No filters available</div>
								}
							</hlm-dropdown-menu-group>
						</hlm-dropdown-menu>
					</ng-template>
				}
			</div>
			<!--ANYTHING HERE WILL BE OUTSIDE WRAPPING DIV -->
			@if (active.length) {
				<button variant="destructive" size="icon" hlmBtn (click)="filter.clear()">
					<ng-icon size="sm" hlm name="lucideFunnelX" />
				</button>
			}
		</div>
	`,
})
export class SpartanRichFilter {
	readonly state = model.required<FilterModelRef>();

	readonly fieldArray = computed(() => this.state().fieldsArray());
	readonly stateValue = computed(() => this.state().value);

	/** Computed array of { component, inputs } entries for NgComponentOutlet. */
	readonly fields = computed(() => {
		return this.fieldArray().map((e) => {
			{
				const id = e.id;
				const component = FIELD_COMPONENT_MAP[e.__type];
				const injector = Injector.create({
					providers: [
						{
							provide: FILTER_HANDLER,
							useFactory: () => FIELD_HANDLERS_MAP[e.__type](e.id, this.state().value),
						},
					],
				});
				console.log('recreating component for field', e.id, 'with type', e.__type);
				return { id, component, injector };
			}
		});
	});
}
