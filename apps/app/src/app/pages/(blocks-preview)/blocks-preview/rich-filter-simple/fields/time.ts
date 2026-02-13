import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTimeInputImports } from '@spartan-ng/helm/time-input';
import { EqualityOperators, TimeOperators } from '../engine/operators';

@Component({
	selector: 'spartan-rich-filter-time-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgIcon,
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmLabelImports,
		HlmIconImports,
		HlmButtonImports,
		BrnSelectImports,
		HlmSelectImports,
		HlmTimeInputImports,
	],
	providers: [provideIcons({ lucideLink2, lucideX })],
	host: {},
	template: `
		<div
			hlmButtonGroup
			class="[&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
		>
			<!-- label -->
			<div hlmButtonGroupText>
				<label class="w-content" hlmLabel [for]="fieldLabel()">{{ label() }}</label>
			</div>
			<!-- operator dropdown -->

			<brn-select class="inline-block" placeholder="Select an option" [value]="operators[0].value">
				<hlm-select-trigger>
					<hlm-select-value>
						<div *brnSelectValue="let value">
							<span>{{ value }}</span>
						</div>
					</hlm-select-value>
				</hlm-select-trigger>
				<hlm-select-content class="!min-w-40">
					@for (operator of operators; track operator.key) {
						<hlm-option [value]="operator.value">
							<span>
								{{ operator.value }}
							</span>
							<span class="text-muted-foreground">{{ operator.key }}</span>
						</hlm-option>
					}
				</hlm-select-content>
			</brn-select>

			<!-- time input -->
			<hlm-time-input class="rounded-none border-l-0 shadow-none" />

			<!-- close button -->
			<button hlmBtn variant="outline" size="icon">
				<ng-icon name="lucideX" />
			</button>
		</div>
	`,
})
export class TimeField {
	readonly label = input.required<string>();

	readonly fieldLabel = computed(() => 'time-' + this.label());

	readonly operators = Object.entries(TimeOperators).map(([key, value]) => ({ key, value }));
}
