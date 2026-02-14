import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { buildFilterModel, fieldBuilder as f } from './engine/builders';
import { Operators } from './engine/operators';
import { RichFilterSimple } from './rich-filter-simple';

const filterModel = buildFilterModel(
	f.text('name', null, Operators.includes),
	f.number('age', null, Operators.greaterThan),
	f.boolean('isActive', null),
	f.select('role', null, Operators.equals),
	f.date('createdAt', null, Operators.lessThan),
	f.daterange('dateRange', null, Operators.between),
	f.range('priceRange', null, Operators.between),
	f.time('time', null, Operators.lessThan),
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
					<pre>{{ filterState.value() | json }}</pre>
				</div>
			</div>
		</div>
	`,
})
export default class RichFilterSimplePage {

	filterState = filterModel;

	recompileFailure = 3;
}
