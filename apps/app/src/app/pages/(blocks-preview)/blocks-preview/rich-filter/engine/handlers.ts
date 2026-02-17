import { computed, WritableSignal } from '@angular/core';
import { BrnTimeValue } from '@spartan-ng/brain/time-input';
import { RFilterField } from './builders';
import { IOperator } from './operators';
import { FieldTypes, IFieldType } from './types';

/**
 * helper function to create typed handlers
 * @returns
 */
function vGuard<T>(): T {
	return undefined as T;
}

export function throwHandlerException(message: string): never {
	throw new Error(`Exception in Handler: ${message}`);
}

function baseHandlers<T, K extends IFieldType>(
	fieldId: string,
	state: WritableSignal<Record<string, RFilterField>>,
	typeGuard: K,
	valueGuard: () => T,
) {
	const _seed = state()[fieldId];

	const type =
		_seed.__type === typeGuard
			? typeGuard
			: throwHandlerException(`Field type mismatch. Expected ${typeGuard}, got ${_seed.__type}`);

	const formId = computed(() => `${type}-${fieldId}` as const);
	const controlValue = computed<T>(() => state()[fieldId].value as T);
	const controlLabel = computed(() => state()[fieldId].__label ?? fieldId);
	const operatorValue = computed(() => state()[fieldId].operator);

	function updateControl<T>(value: T) {
		state.update((v) => (v[fieldId] ? ({ ...v, [fieldId]: { ...v[fieldId], value } } as typeof v) : v));
	}

	const closeField = () => {
		state.update((v) => {
			const { [fieldId]: _, ...rest } = v;
			return { ...rest, [fieldId]: { ..._seed, __visible: false } } as typeof v;
		});
	};

	const setOperator = (operator: IOperator | IOperator[] | undefined) => {
		const update = operator
			? Array.isArray(operator)
				? (operator.at(0) ?? _seed.operator)
				: operator
			: _seed.operator;

		state.update((v) => (v[fieldId] ? ({ ...v, [fieldId]: { ...v[fieldId], operator: update } } as typeof v) : v));
	};

	return { formId, controlValue, controlLabel, operatorValue, closeField, setOperator, updateControl, type };
}

export function booleanFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const {
		operatorValue: _,
		setOperator: __,
		...rest
	} = baseHandlers(fieldId, state, FieldTypes.boolean, vGuard<boolean>);

	return {
		...rest,
	};
}

export function textFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const base = baseHandlers(fieldId, state, FieldTypes.text, vGuard<string>);

	const fieldRequired = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.text ? (v.__required ?? false) : false;
	});

	return {
		...base,
		type: FieldTypes.text,
		fieldRequired,
	};
}

export function numberFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const base = baseHandlers(fieldId, state, FieldTypes.number, vGuard<number>);

	const min = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.number ? (v.__min ?? Number.MIN_SAFE_INTEGER) : null;
	});

	const max = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.number ? (v.__max ?? Number.MAX_SAFE_INTEGER) : null;
	});

	const step = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.number ? (v.__step ?? 1) : null;
	});

	return {
		...base,
		type: FieldTypes.number,
		min,
		max,
		step,
	};
}

export function dateFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const base = baseHandlers(fieldId, state, FieldTypes.date, vGuard<Date>);

	const min = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.date && v.__min ? v.__min : null;
	});

	const max = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.date && v.__max ? v.__max : null;
	});

	return {
		...base,
		type: FieldTypes.date,
		min,
		max,
	};
}

export function timeFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const seed = state()[fieldId];
	const base = baseHandlers(fieldId, state, FieldTypes.time, vGuard<Date>);

	const min = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.time && v.__min ? v.__min : null;
	});

	const max = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.time && v.__max ? v.__max : null;
	});

	// state understands Date, filter talks in { hours: number; minutes: number; seconds: number; period: 'AM' | 'PM' }
	const updateTimeControl = (value: BrnTimeValue) => {
		const d = new Date(state()[fieldId].value as Date);
		let hours = value.hours % 12;
		if (value.period === 'PM') hours += 12;
		d.setHours(hours, value.minutes, value.seconds, 0);
		base.updateControl(d);
	};

	// state understands Date, filter talks in { hours: number; minutes: number; seconds: number; period: 'AM' | 'PM' }
	const timeControlValue = computed(() => {
		const v = (state()[fieldId].value ?? seed.value) as Date;
		const hours = v.getHours();
		const minutes = v.getMinutes();
		const seconds = v.getSeconds();
		const period = hours >= 12 ? 'PM' : 'AM';
		return { hours: hours % 12 || 12, minutes, seconds, period } satisfies BrnTimeValue;
	});

	return {
		...base,
		type: FieldTypes.time,
		min,
		max,
		updateControl: updateTimeControl,
		controlValue: timeControlValue,
	};
}

export function selectFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const base = baseHandlers(fieldId, state, FieldTypes.select, vGuard<unknown | unknown[]>);

	const updateSelectControl = (value: unknown | unknown[]) => {
		const update = Array.isArray(value) ? value.at(0) : value;
		base.updateControl(update);
	};

	const options = computed(() => {
		const v = state()[fieldId];
		if (v.__type === FieldTypes.select && v.__options) {
			return v.__options;
		} else return [];
	});

	const selectedOptionLabel = computed(() => {
		const v = state()[fieldId];

		if (v.__type !== FieldTypes.select) {
			return '';
		}

		return v.__itemToString(base.controlValue());
	});

	return {
		...base,
		type: FieldTypes.select,
		updateControl: updateSelectControl,
		selectedOptionLabel,
		options,
	};
}

export function rangeFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const base = baseHandlers(fieldId, state, FieldTypes.range, vGuard<[number, number]>);

	const min = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.range ? v.__min : null;
	});

	const max = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.range ? v.__max : null;
	});

	return {
		...base,
		type: FieldTypes.range,
		min,
		max,
	};
}

export function dateRangeFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const base = baseHandlers(fieldId, state, FieldTypes.daterange, vGuard<[Date, Date]>);

	const min = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.daterange ? v.__min : null;
	});

	const max = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.daterange ? v.__max : null;
	});

	return {
		...base,
		type: FieldTypes.daterange,
		min,
		max,
	};
}

export function comboboxFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const base = baseHandlers(fieldId, state, FieldTypes.combobox, vGuard<unknown>);

	const options = computed(() => {
		const v = state()[fieldId];
		if (v.__type === FieldTypes.combobox && v.__options) {
			return v.__options;
		} else return [];
	});

	const placeholder = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.combobox && v.__placeholder ? v.__placeholder : '';
	});

	return {
		...base,
		options,
		placeholder,
		type: FieldTypes.combobox,
	};
}

export function asyncComboFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const __seed = state()[fieldId];
	const base = baseHandlers(fieldId, state, FieldTypes.asyncCombobox, vGuard<unknown>);

	const placeholder = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.asyncCombobox && v.__placeholder ? v.__placeholder : '';
	});

	const itemToString = computed(() => {
		const v = state()[fieldId];
		return v.__type === FieldTypes.asyncCombobox && v.__itemToString
			? v.__itemToString
			: (item: unknown) => String(item);
	});

	const fieldResourceRequest = computed(() => {
		const v = state()[fieldId];
		return (
			(v.__type === FieldTypes.asyncCombobox && v.__resourceRequest) ||
			throwHandlerException('Resource request is required for async combobox field')
		);
	});

	const fieldResourceOptions =
		(__seed.__type === FieldTypes.asyncCombobox && __seed.__resourceOptions) ||
		throwHandlerException('Resource options is required for async combobox field');

	return {
		...base,
		placeholder,
		itemToString,
		fieldResourceRequest,
		fieldResourceOptions,
		type: FieldTypes.asyncCombobox,
	};
}

// functions above are only exported for unit testing purposes
// for any other use case, consider using the FIELD_HANDLERS_MAP

export const FIELD_HANDLERS_MAP = {
	[FieldTypes.asyncCombobox]: asyncComboFieldHandlers,
	[FieldTypes.boolean]: booleanFieldHandlers,
	[FieldTypes.combobox]: comboboxFieldHandlers,
	[FieldTypes.date]: dateFieldHandlers,
	[FieldTypes.daterange]: dateRangeFieldHandlers,
	[FieldTypes.number]: numberFieldHandlers,
	[FieldTypes.range]: rangeFieldHandlers,
	[FieldTypes.select]: selectFieldHandlers,
	[FieldTypes.text]: textFieldHandlers,
	[FieldTypes.time]: timeFieldHandlers,
};

export type TFieldHandlers = ReturnType<(typeof FIELD_HANDLERS_MAP)[IFieldType]>;

export type FHandler<K> = K extends IFieldType ? ReturnType<(typeof FIELD_HANDLERS_MAP)[K]> : never;
