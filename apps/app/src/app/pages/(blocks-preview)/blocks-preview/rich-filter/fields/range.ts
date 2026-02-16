import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmRangeSliderImports, RangeValue } from '@spartan-ng/helm/range-slider';
import { RangeOperators } from '../engine/operators';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';
import { FieldTypes } from '../engine/types';
import { RICH_FILTER_MODEL } from '../engine/token';

@Component({
	selector: 'spartan-rich-filter-range-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		// HlmInputImports,
		HlmPopoverImports,
		HlmRangeSliderImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
	],
	providers: [provideIcons({ lucideLink2, lucideX })],
	host: {},
	template: `
		<hlm-popover sideOffset="5" align="end">
			<div
				hlmButtonGroup
				class="[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
			>
				<!-- label -->
				<spartan-rich-filter-field-label [for]="controlId()" />
				<!-- operator dropdown -->
				<spartan-rich-filter-field-operator  [fieldId]="id()" [operators]="operators" />

				<!-- popover with slider -->
				<button variant="outline" hlmPopoverTrigger hlmBtn variant="outline">
					{{ _displayRange() }}
				</button>
				<hlm-popover-content class="rounded-xl p-0 text-sm" *hlmPopoverPortal="let ctx">
					<div class="p-4 text-sm">
						@let opts = options();
						<hlm-range-slider
							[min]="opts.min"
							[max]="opts.max"
							[value]="controlValue()"
							(valueChange)="updateControlValue($event)"
						/>
					</div>
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close [fieldId]="id()" />
			</div>
		</hlm-popover>
	`,
})
export class RangeField {
	private readonly engine = inject(RICH_FILTER_MODEL);

	readonly id = input.required<string>();

	readonly controlId = computed(() => 'range-' + this.id());

	readonly label = computed(() => this.engine.fieldLabel(this.id()));

	readonly operators = RangeOperators;

	readonly options = computed(() => this.engine.fieldMinMax<typeof FieldTypes.daterange>(this.id()));

	readonly controlValue = computed<RangeValue>(() => {
		const v = this.engine.fieldValue<{ min: number; max: number } | null>(this.id());
		const { min, max } = this.options();
		return v ? [v.min, v.max] : [min ?? 0, max ?? 100];
	});

	protected readonly _displayRange = computed(() => {
		const [low, high] = this.controlValue();
		return `${low >= 0 ? low : `(${low})`} - ${high >= 0 ? high : `(${high})`}`;
	});

	protected updateControlValue(value: RangeValue) {
		this.engine.patchFieldValue(this.id(), { min: value[0], max: value[1] });
	}
}
