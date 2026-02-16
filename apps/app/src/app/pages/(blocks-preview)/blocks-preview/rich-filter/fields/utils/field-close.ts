import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { FilterModelRef } from '../../engine/builders';
import { RICH_FILTER_MODEL } from '../../engine/token';

@Component({
	selector: 'spartan-rich-filter-field-close',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgIcon, HlmButtonImports, HlmIconImports],
	providers: [provideIcons({ lucideX })],
	host: {
		style: 'display: contents',
	},
	template: `
		<button
			(click)="clean(fieldId())"
			hlmBtn
			variant="outline"
			size="icon"
			class="rounded-l-none border-l-0"
		>
			<ng-icon name="lucideX" />
		</button>
	`,
})
export class FieldClose {

	private readonly engine = inject(RICH_FILTER_MODEL);
	readonly fieldId = input.required<string>();

	protected readonly clean = this.engine.cleanField;

}
