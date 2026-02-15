import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ViewEncapsulation } from '@angular/core';
import { buildFilterModel, fieldBuilder as f } from './engine/builders';
import { Operators } from './engine/operators';
import { SpartanRichFilter } from './rich-filter';
import { filterParser } from './engine/parser';

const roleOptions = [
	{ label: 'Admin', value: 'admin' },
	{ label: 'User', value: 'user' },
	{ label: 'Guest', value: 'guest' },
];

const comboboxOptions = [
	{ label: 'United States', value: 'US' },
	{ label: 'Canada', value: 'CA' },
	{ label: 'United Kingdom', value: 'UK' },
	{ label: 'Australia', value: 'AU' },
	{ label: 'Germany', value: 'DE' },
	{ label: 'France', value: 'FR' },
	{ label: 'Japan', value: 'JP' },
	{ label: 'China', value: 'CN' },
	{ label: 'India', value: 'IN' },
	{ label: 'Brazil', value: 'BR' },
];

const filterModel = buildFilterModel(
	f.text('name', '', Operators.includes, { required: true }),
	f.number('age', 0, Operators.greaterThan, { min: 0 , max: 120, step: 1}),
	f.boolean('isActive', true),
	f.select('role', null, Operators.is, { options: roleOptions}),
	f.date('createdAt', new Date(), Operators.lessThan, { max: new Date() }),
	f.daterange('dateRange', { start: new Date(), end: new Date() }, Operators.between, { max: new Date() }),
	f.range('priceRange', null, Operators.between, { min: -100, max: 100 }),
	f.time('time', new Date(), Operators.notPast),
	f.combobox('country', '', Operators.is, { options: comboboxOptions, placeholder: 'Select a country' })
);

@Component({
	selector: 'spartan-rich-filter-page',
	imports: [SpartanRichFilter, JsonPipe],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div class="w-full max-w-6xl">
				<spartan-rich-filter [state]="filterState" />
				<div class="mt-10">
					<div>Parsed Value</div>
					<pre>{{ payload() | json }}</pre>
				</div>
				<div class="mt-10">
					<div>Raw Value</div>
					<pre>{{ filterState.value() | json }}</pre>
				</div>
			</div>
		</div>
	`,
})
export default class RichFilterPage {

	readonly filterState = filterModel;

	readonly parserFn = filterParser;

	readonly payload = computed(()=>this.parserFn(this.filterState.value()));

}
