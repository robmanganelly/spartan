import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { buildFilterModel, fieldBuilder as f } from './engine/builders';
import { Operators } from './engine/operators';
import { RichFilterSimple } from './rich-filter-simple';

const filterModel = buildFilterModel(
	f.text('name', null, Operators.includes, { initialVisible: true }),
	f.number('age', null, Operators.greaterThan, { initialVisible: true }),
	f.boolean('isActive', null, Operators.equals, { initialVisible: true }),
	f.select('role', null, Operators.equals, { initialVisible: true }),
	f.date('createdAt', null, Operators.lessThan, { initialVisible: true }),
	f.daterange('dateRange', null, Operators.between, { initialVisible: true }),
	f.range('priceRange', null, Operators.between, { initialVisible: true }),
	f.time('time', null, Operators.lessThan, { initialVisible: true }),
	f.combobox('country', null, Operators.equals, { initialVisible: true })
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
					<pre>{{ filterState.value() | json }}</pre>
				</div>
			</div>
		</div>
	`,
})
export default class RichFilterSimplePage {

	filterState = filterModel;
}
