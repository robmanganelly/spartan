import { computed, WritableSignal } from '@angular/core';
import { BrnTimeValue } from '@spartan-ng/brain/time-input';
import { RFilterField } from './builders';
import { IOperator } from './operators';
import { FieldTypes, IFieldType } from './types';

export function throwHandlerException(message: string): never {
	throw new Error(message);
}

function baseHandlers<T>(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	// state keeps the initial value when the function is call, which will be used to reset the field when needed

	const _seed = state()[fieldId];
	const formId = computed(() => `${FieldTypes.boolean}-${fieldId}` as const);
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

	return { formId, controlValue, controlLabel, operatorValue, closeField, setOperator, updateControl };
}

export function booleanFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const base = baseHandlers<boolean>(fieldId, state);

	return {
		...base,
		type: FieldTypes.boolean,
	};
}

export function textFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const base = baseHandlers<string>(fieldId, state);

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
	const base = baseHandlers<number>(fieldId, state);

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
	const base = baseHandlers<Date>(fieldId, state);

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
	const base = baseHandlers<Date>(fieldId, state);

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
	const base = baseHandlers<unknown | unknown[]>(fieldId, state);

	const updateSelectControl = (value: unknown | unknown[]) => {

		const update = Array.isArray(value) ? value.at(0) : value;
		base.updateControl(update);
	};

	const options = computed(() => {
		const v = state()[fieldId];
		if (v.__type === FieldTypes.select && v.__options) {
			return v.__options;
		}
		else return [];
	});

	const selectedOptionLabel = computed(()=>{

		const v = state()[fieldId];

		if (v.__type !== FieldTypes.select) { return ''}

		return v.__itemToString(base.controlValue())

	})

	return {
		...base,
		type: FieldTypes.select,
		updateControl: updateSelectControl,
		selectedOptionLabel,
		options,
	};
}

export function rangeFieldHandlers(fieldId: string, state: WritableSignal<Record<string, RFilterField>>) {
	const seed = state()[fieldId];
	const base = baseHandlers<[number, number]>(fieldId, state);

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

// functions above are only exported for unit testing purposes
// for any other use case, consider using the FIELD_HANDLERS_MAP

export const FIELD_HANDLERS_MAP = {
	[FieldTypes.asyncCombobox]: () => {},
	[FieldTypes.boolean]: booleanFieldHandlers,
	[FieldTypes.combobox]: () => {},
	[FieldTypes.date]: dateFieldHandlers,
	[FieldTypes.daterange]: () => {},
	[FieldTypes.number]: numberFieldHandlers,
	[FieldTypes.range]: rangeFieldHandlers,
	[FieldTypes.select]: selectFieldHandlers,
	[FieldTypes.text]: textFieldHandlers,
	[FieldTypes.time]: timeFieldHandlers,
};

export type TFieldHandlers = ReturnType<(typeof FIELD_HANDLERS_MAP)[IFieldType]>;

export type FHandler<K> = K extends IFieldType ? ReturnType<(typeof FIELD_HANDLERS_MAP)[K]> : never;
