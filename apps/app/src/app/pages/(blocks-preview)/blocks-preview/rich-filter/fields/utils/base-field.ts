import { computed, Directive, inject, input } from '@angular/core';
import { RFilterField } from '../../engine/builders';
import { RICH_FILTER_MODEL } from '../../engine/token';

/**
 * Only for use as a base class for new filter fields.
 */
@Directive({ standalone: true })
export abstract class BaseFilterField<T extends RFilterField['value']> {
	public readonly engine = inject(RICH_FILTER_MODEL);

	public readonly id = input.required<string>();

	protected readonly label = computed(() => this.engine.fieldLabel(this.id()));

	protected readonly labelFor = computed(() => this.engine.fieldType(this.id()) + '-' + this.id());

	readonly controlValue = computed(() => this.engine.fieldValue<T>(this.id()));

	protected updateControl(value: T ) {
		this.engine.patchFieldValue(this.id(), value);
		const cleanup = this.afterUpdate?.bind(this);
		if (cleanup) {Promise.resolve().then(cleanup);}
	}

	/**
	 * Use as effect after updating the control value
	 * It will run asynchronously after the control value has been updated.
	 * so it's safe to perform operations that depend on the updated value or the view being updated.
	 */
	protected afterUpdate: (() => void) | null = null;
}
