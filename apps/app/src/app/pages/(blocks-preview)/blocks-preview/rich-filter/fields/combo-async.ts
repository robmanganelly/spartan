import { httpResource, HttpResourceRef } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Injector,
	input,
	isSignal,
	OnInit,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideLink2, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { FilterModelRef } from '../engine/builders';
import { QueryToken } from '../engine/constants';
import { IdentityOperators } from '../engine/operators';
import { FieldClose } from './utils/field-close';
import { FieldLabel } from './utils/field-label';
import { FieldOperator } from './utils/field-operator';

@Component({
	selector: 'spartan-rich-filter-combo-async-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HlmButtonGroupImports,
		HlmIconImports,
		HlmButtonImports,
		HlmComboboxImports,
		HlmSpinnerImports,
		FieldClose,
		FieldLabel,
		FieldOperator,
		FormsModule,
	],
	providers: [provideIcons({ lucideLink2, lucideX })],
	host: {},
	template: `
		@let rs = _resource;
		@if (rs) {
			<div
				hlmButtonGroup
				class="[&_hlm-input-group]:!rounded-none [&_hlm-input-group]:!border-l-0 [&>brn-select>div>hlm-select-trigger>button]:rounded-l-none [&>brn-select>div>hlm-select-trigger>button]:rounded-r-none"
			>
				<!-- label -->
				<spartan-rich-filter-field-label [label]="id()" [for]="fieldLabel()" />
				<!-- operator dropdown -->
				<spartan-rich-filter-field-operator [state]="state()" [fieldId]="id()" [operators]="operators" />

				<!-- async combobox -->
				<hlm-combobox
					[(search)]="_query"
					[ngModel]="controlValue()"
					(ngModelChange)="updateControlValue($event)"
					[itemToString]="_itemToString()"
				>
					<hlm-combobox-input [placeholder]="placeholder()" class="rounded-none border-l-0" />
					<hlm-combobox-content *hlmComboboxPortal>
						@if (showStatus()) {
							<hlm-combobox-status>
								@if (rs.error(); as error) {
									{{ error }}
								} @else if (rs.isLoading()) {
									<hlm-spinner />
									Loading...
								} @else if (_query().length === 0) {
									Type to search.
								} @else {
									No matches for "{{ _query() }}".
								}
							</hlm-combobox-status>
						}
						@if (!rs.isLoading()) {
							<hlm-combobox-empty>Try a different search term.</hlm-combobox-empty>
						}
						<div hlmComboboxList>
							@if (rs.hasValue()) {
								@for (item of parsedItems(); track item.raw) {
									<hlm-combobox-item [value]="item.raw">{{ item.label }}</hlm-combobox-item>
								}
							}
						</div>
					</hlm-combobox-content>
				</hlm-combobox>

				<!-- close button -->
				<spartan-rich-filter-field-close [state]="state()" [fieldId]="id()" />
			</div>
		}
	`,
})
export class ComboAsyncField implements OnInit {
	readonly id = input.required<string>();
	readonly state = input.required<FilterModelRef>();

	readonly fieldLabel = computed(() => 'combo-async-' + this.id());

	readonly operators = IdentityOperators;

	readonly controlValue = computed(() => this.state().fieldValue(this.id()));

	readonly placeholder = computed(() => this.state().fieldPlaceholder(this.id()));

	readonly resourceRequest = computed(() => {
		const req = this.state().fieldResourceRequest(this.id());
		let raw = isSignal(req) ? req() : req
		if (raw.url.includes(QueryToken)) {
			raw = {...raw, url: raw.url.replace(QueryToken, this._query())};
		}
		return raw;
	});

	readonly resourceOptions = computed(() => {
		const opts = this.state().fieldResourceOptions(this.id());
		return isSignal(opts) ? opts() : opts;
	});

	// TODO switch to service based engine to inject the service
	// and mitigate this problem
	/**
	 * Resource ref is assigned in the OnInit
	 * hook because it depends on an input that won't be available at
	 * the time of the component instantiation.
	 */
	protected _resource: HttpResourceRef<unknown[] | undefined> | null = null;
	//  = httpResource<unknown[]>(this.resourceRequest, this.resourceOptions());

	private readonly injector = inject(Injector);

	ngOnInit() {
		this._resource = httpResource(this.resourceRequest, { ...this.resourceOptions(), injector: this.injector });
	}

	protected readonly _query = signal('');

	protected readonly _itemToString = computed(() => this.state().fieldItemToString(this.id()));

	protected readonly showStatus = computed(
		() =>
			this._resource &&
			(this._resource.error() ||
				this._resource.isLoading() ||
				this._query().length === 0 ||
				(this._resource.hasValue() && (this._resource.value() as unknown[]).length === 0)),
	);

	protected readonly parsedItems = computed(() => {
		const vs = this._resource && this._resource.hasValue() ? (this._resource.value() as unknown[]) : [];
		const parser = this._itemToString();

		return vs.map((v) => ({ raw: v, label: parser(v) }));
	});

	protected updateControlValue(value: unknown) {
		this.state().patchFieldValue(this.id(), value as string);
	}
}
