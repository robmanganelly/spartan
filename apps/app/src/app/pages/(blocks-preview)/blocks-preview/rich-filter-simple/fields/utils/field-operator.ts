import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-rich-filter-field-operator',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [BrnSelectImports, HlmSelectImports],
	host: { style: 'display: contents' },
	template: `
		<brn-select
			class="
			[&>div>hlm-select-trigger>button]:border-l-none
			[&>div>hlm-select-trigger>button]:border-r-none
			inline-block [&>div>hlm-select-trigger>button]:rounded-none
			"
			placeholder="Select an option"
			[value]="_operators()[0].value"
		>
			<hlm-select-trigger>
				<hlm-select-value>
					<div *brnSelectValue="let value">
						<span>{{ value }}</span>
					</div>
				</hlm-select-value>
			</hlm-select-trigger>
			<hlm-select-content class="!min-w-40">
				@for (operator of _operators(); track operator.key) {
					<hlm-option [value]="operator.value">
						<span>
							{{ operator.value }}
						</span>
						<span class="text-muted-foreground">{{ operator.key }}</span>
					</hlm-option>
				}
			</hlm-select-content>
		</brn-select>
	`,
})
export class FieldOperator {
	readonly operators = input.required<Record<string, string>>();

	protected readonly _operators = computed(() =>
		Object.entries(this.operators()).map(([key, value]) => ({ key, value })),
	);
}
