import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockViewer } from '@spartan-ng/app/app/shared/blocks/block-viewer';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/blocks - Rich Filter', 'Rich Filter blocks using spartan/ui primitives'),
	title: 'spartan/blocks - Rich Filter',
};

@Component({
	selector: 'spartan-rich-filter',
	imports: [BlockViewer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col',
	},
	template: `
		<spartan-block-viewer
		block="rich-filter"
		title="A simple rich filter"
		id="rich-filter-1" />
	`,
})
export default class RichFilterPage {}
