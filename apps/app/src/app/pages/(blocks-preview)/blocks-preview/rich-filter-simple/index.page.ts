import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ViewEncapsulation } from '@angular/core';
import { buildFilterModel, fieldBuilder as f } from './engine/builders';
import { Operators } from './engine/operators';
import { RichFilterSimple } from './rich-filter-simple';
import { filterParser } from './engine/parser';

const filterModel = buildFilterModel(
	f.text('name', null, Operators.includes),
	f.number('age', null, Operators.greaterThan),
	f.boolean('isActive', null),
	f.select('role', null, Operators.equals),
	f.date('createdAt', new Date(), Operators.lessThan),
	f.daterange('dateRange', null, Operators.between),
	f.range('priceRange', null, Operators.between),
	f.time('time', new Date(), Operators.lessThan),
	f.combobox('country', null, Operators.equals)
);

@Component({
	selector: 'spartan-rich-filter-simple',
	imports: [RichFilterSimple, JsonPipe],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div class="w-full max-w-6xl">
				<spartan-simple-rich-filter [state]="filterState" />
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
export default class RichFilterSimplePage {

	readonly filterState = filterModel;

	readonly parserFn = filterParser;

	readonly payload = computed(()=>this.parserFn(this.filterState.value()));


}
