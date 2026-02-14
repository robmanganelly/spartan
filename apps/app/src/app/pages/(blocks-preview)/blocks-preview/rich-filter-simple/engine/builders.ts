import { computed, Signal, signal } from '@angular/core';
import { IOperator, ITextOperator, Operators } from './operators';
import { FieldTypes, IFieldType } from './types';

const buildTextField = <S extends string>(
	id: S,
	value: string | null,
	operator: ITextOperator,
	options?: {
		initialVisible?: boolean;
	},
) => ({
	id,
	__type: FieldTypes.text,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
});

export const buildNumberField = <S extends string>(
	id: S,
	value: number | null,
	operator: IOperator,
	options?: {
		initialVisible?: boolean;
	},
) => ({
	id,
	__type: FieldTypes.number,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
});

export const buildDateField = <S extends string>(
	id: S,
	value: Date,
	operator: IOperator,
	options?: {
		initialVisible?: boolean;
	},
) => ({
	id,
	__type: FieldTypes.date,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
});

export const buildTimeField = <S extends string>(
	id: S,
	value: string | null,
	operator: IOperator,
	options?: {
		initialVisible?: boolean;
	},
) => ({
	id,
	__type: FieldTypes.time,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
});

export const buildSelectField = <S extends string>(
	id: S,
	value: string | null,
	operator: IOperator,
	options?: {
		initialVisible?: boolean;
	},
) => ({
	id,
	__type: FieldTypes.select,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
});

export const buildComboField = <S extends string>(
	id: S,
	value: string | null,
	operator: IOperator,
	options?: {
		initialVisible?: boolean;
	},
) => ({
	id,
	__type: FieldTypes.combobox,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
});

export const buildBooleanField = <S extends string>(
	id: S,
	value: boolean | null,
	options?: {
		initialVisible?: boolean;
	},
) => ({
	id,
	__type: FieldTypes.boolean,
	value,
	// boolean fields are always "is" to maker the UX simpler
	// double negatives like "is not false" can be confusing
	// this field is not intended for indeterminate boolean states, so we don't need "is not" or "is any"
	operator: Operators.is,
	__index: 0,
	__visible: !!options?.initialVisible,
});

export const buildRangeField = <S extends string>(
	id: S,
	value: { min: number; max: number } | null,
	operator: IOperator,
	options?: {
		initialVisible?: boolean;
	},
) => ({
	id,
	__type: FieldTypes.range,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
});

export const buildDateRangeField = <S extends string>(
	id: S,
	value: { start: Date; end: Date } | null,
	operator: IOperator,
	options?: {
		initialVisible?: boolean;
	},
) => ({
	id,
	__type: FieldTypes.daterange,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
});

export const fieldBuilder = {
	[FieldTypes.text]: buildTextField,
	[FieldTypes.number]: buildNumberField,
	[FieldTypes.date]: buildDateField,
	[FieldTypes.time]: buildTimeField,
	[FieldTypes.select]: buildSelectField,
	[FieldTypes.boolean]: buildBooleanField,
	[FieldTypes.range]: buildRangeField,
	[FieldTypes.daterange]: buildDateRangeField,
	[FieldTypes.combobox]: buildComboField,
};

export type RFilterField = ReturnType<(typeof fieldBuilder)[IFieldType]>;

export function buildFilterModel<T extends RFilterField[]>(...fields: [...T]) {
	const _base = fields.reduce(
		(acc, field, i) => {
			field.__index = i;
			acc[field.id as T[number]['id']] = field;
			return acc;
		},
		{} as Record<T[number]['id'], T[number]>,
	);
	const _v = signal(_base);

	const _baseIndex = signal(fields.length);

	const fieldsArray = computed(() => {
		const v = _v();
		const unsorted = fields.map((f) => v[f.id as T[number]['id']]).filter((f) => f.__visible);
		unsorted.sort((a, b) => a.__index - b.__index);
		return unsorted;
	});

	const availableFields = computed(() => {
		const v = _v();
		return fields.map((f) => v[f.id as T[number]['id']]).filter((f) => !f.__visible);
	});

	// ===== whole state manipulation =====
	const reset = () => {
		_v.set(_base);
	};

	// ===== single field update =====

	const patchOperator = (fieldId: T[number]['id'], operator: IOperator) => {
		const field = _v()[fieldId];
		if (!field) return;
		_v.update((s) => ({
			...s,
			[fieldId]: {
				...field,
				operator,
			},
		}));
	};

	const patchValue = (fieldId: T[number]['id'], value: T[number]['value']) => {
		const field = _v()[fieldId];
		if (!field) return;
		_v.update((s) => ({
			...s,
			[fieldId]: {
				...field,
				value,
			},
		}));
	};

	// ==== field removal =====
	// const removeField = (fieldId: T[number]['id']) => {
	// 	_v.update((s) => {
	// 		const { [fieldId]: _, ...rest } = s;
	// 		return rest as typeof s;
	// 	});
	// };

	const cleanField = (fieldId: T[number]['id']) => {
		_v.update((s) => ({
			...s,
			[fieldId]: {
				...s[fieldId],
				// Date can never be null or the calendar component will break
				value: s[fieldId].__type === FieldTypes.date ? new Date() : null,
				operator: null,
				__visible: false,
			},
		}));
	};

	// ==== field addition =====
	// const addField = (fieldId: T[number]['id']) => {
	// 	_v.update((s) => ({
	// 		...s,
	// 		[fieldId]: _base[fieldId as T[number]['id']],
	// 	}));
	// };

	const addField = (fieldId: T[number]['id']) => {
		const fieldToAdd = _base[fieldId as T[number]['id']];
		if (!fieldToAdd) return;
		_baseIndex.update((i) => i + 1);
		_v.update((s) => ({
			...s,
			[fieldId]: { ...fieldToAdd, __index: _baseIndex(), __visible: true },
		}));
	};

	const clear = () => {
		_v.update((s) => {
			const c = structuredClone(s);
			for (const key in c) {
				c[key as T[number]['id']] = {
					..._base[key as T[number]['id']],
					__visible: false,
					__index: 0,
				} satisfies T[number];
			}
			return c;
		});
	};

	const fieldValue = <V extends T[number]['value']>(fieldId: T[number]['id']): V => {
		const field = _v()[fieldId];
		return field.value as V;
	};

	return {
		value: _v.asReadonly(),
		reset,
		patchFieldOperator: patchOperator,
		patchFieldValue: patchValue,
		// use this function to "remove" a field. the model cannot have dynamic fields, so we set the value and operator to null instead
		cleanField,
		// addfield is used to add back a "removed" field by resetting its value and operator to the initial state defined in _base
		addField,
		fieldsArray,
		availableFields,
		clear,
		fieldValue,
	};
}

// Base interface for component inputs - uses 'never' in contravariant positions to accept any specific implementation
export interface FilterModelRef<TId extends string = string, TFields extends RFilterField = RFilterField> {
	readonly value: Signal<Record<string, TFields>>;
	reset(): void;
	patchFieldOperator(fieldId: TId, operator: IOperator): void;
	patchFieldValue(fieldId: TId, value: TFields['value']): void;
	cleanField(fieldId: TId): void;
	addField(fieldId: TId): void;
	fieldsArray: Signal<TFields[]>;
	availableFields: Signal<TFields[]>;
	clear(): void;
	fieldValue<V extends TFields['value']>(fieldId: TId): V;
}

// Infer exact type from a specific buildFilterModel call
export type InferFilterModel<T> =
	T extends FilterModelRef<infer TId, infer TFields> ? FilterModelRef<TId, TFields> : never;
