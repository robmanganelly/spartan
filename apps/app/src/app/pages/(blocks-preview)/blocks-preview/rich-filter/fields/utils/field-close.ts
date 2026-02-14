import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { FilterModelRef } from '../../engine/builders';

@Component({
	selector: 'spartan-rich-filter-field-close',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgIcon, HlmButtonImports, HlmIconImports],
	providers: [provideIcons({ lucideX })],
	host: {
		style: 'display: contents',
	},
	template: `
		<button (click)="state().cleanField(fieldId())" hlmBtn variant="outline" size="icon" class="rounded-l-none border-l-0">
			<ng-icon name="lucideX" />
		</button>
	`,
})
export class FieldClose {
	readonly state = input.required<FilterModelRef>();
	readonly fieldId = input.required<string>();
}
