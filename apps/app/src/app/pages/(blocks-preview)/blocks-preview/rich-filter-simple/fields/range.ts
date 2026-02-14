import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FilterModelRef } from '../engine/builders';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmRangeSliderImports } from '@spartan-ng/helm/range-slider';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { RangeOperators } from '../engine/operators';
import { FieldClose } from '../utils/field-close';

@Component({
	selector: 'spartan-rich-filter-range-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgIcon,
		HlmInputGroupImports,
		HlmButtonGroupImports,
		HlmLabelImports,
		HlmIconImports,
		HlmButtonImports,
		// HlmInputImports,
		BrnSelectImports,
		HlmSelectImports,
		HlmPopoverImports,
		HlmRangeSliderImports,
		FieldClose,
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
				<div hlmButtonGroupText>
					<label class="w-content" hlmLabel [for]="fieldLabel()">{{ id() }}</label>
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

				<!-- popover with slider -->
				<button id="edit-profile" variant="outline" hlmPopoverTrigger hlmBtn variant="outline">
					<!-- <ng-icon hlm name="lucideChevronDown" size="sm" /> -->
					10 - 250
				</button>
				<hlm-popover-content class="rounded-xl p-0 text-sm" *hlmPopoverPortal="let ctx">
					<!-- <div class="border-input border-b px-4 py-3"> -->
					<!-- <div class="text-sm font-medium">Agent Tasks</div> -->
					<!-- </div> -->
					<div class="p-4 text-sm">
						<hlm-range-slider />
						<!-- <textarea
							hlmInput
							placeholder="Describe your task in natural language."
							class="mb-4 min-h-16 resize-none"
						></textarea>
						<p class="mb-2 font-medium">Start a new task with Copilot</p>
						<p class="text-muted-foreground">
							Describe your task in natural language. Copilot will work in the background and open a pull request for
							your review.
						</p> -->
					</div>
				</hlm-popover-content>

				<!-- close button -->
				<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
			</div>
		</hlm-popover>
	`,
})
export class RangeField {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'range-' + this.id());

	readonly operators = Object.entries(RangeOperators).map(([key, value]) => ({ key, value }));
}
