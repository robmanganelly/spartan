import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { RICH_FILTER_MODEL } from '../../engine/token';

@Component({
	selector: 'spartan-rich-filter-field-label',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HlmButtonGroupImports, HlmLabelImports],
	host: { style: 'display: contents' },
	template: `
		<div hlmButtonGroupText class="rounded-r-none border-r-0">
			<label class="w-content" hlmLabel [for]="for()">{{ label() }}</label>
		</div>
	`,
})
export class FieldLabel {

	private readonly engine = inject(RICH_FILTER_MODEL);

	readonly for = input.required<string>();

	protected readonly label = computed(() => this.engine.fieldLabel(this.for()));
}
