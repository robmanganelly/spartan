import { computed, ResourceRef, Signal, signal, WritableSignal } from '@angular/core';
import { IEqualityOperator, IIdentityOperator, IOperator, ITextOperator, ITimeOperator, Operators } from './operators';
import { FieldTypes, IFieldType } from './types';
import { HttpResourceOptions, HttpResourceRequest } from '@angular/common/http';

const buildTextField = <S extends string>(
	id: S,
	value: string,
	operator: ITextOperator,
	options?: {
		initialVisible?: boolean;
		required?: boolean;
		placeholder?: string;
	},
) => ({
	id,
	__type: FieldTypes.text,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__required: !!options?.required,
	__placeholder: options?.placeholder,
});

export const buildNumberField = <S extends string>(
	id: S,
	value: number,
	operator: IEqualityOperator,
	options?: {
		initialVisible?: boolean;
		min?: number;
		max?: number;
		step?: number;
	},
) => ({
	id,
	__type: FieldTypes.number,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__min: options?.min,
	__max: options?.max,
	__step: options?.step,
});

export const buildDateField = <S extends string>(
	id: S,
	value: Date,
	operator: IEqualityOperator,
	options?: {
		initialVisible?: boolean;
		min?: Date;
		max?: Date;
	},
) => ({
	id,
	__type: FieldTypes.date,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__min: options?.min,
	__max: options?.max,
});

export const buildTimeField = <S extends string>(
	id: S,
	value: Date,
	operator: ITimeOperator,
	options?: {
		initialVisible?: boolean;
		min?: Date;
		max?: Date;
	},
) => ({
	id,
	__type: FieldTypes.time,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__min: options?.min,
	__max: options?.max,
});

export const buildSelectField = <S extends string>(
	id: S,
	value: string | null,
	operator: IIdentityOperator,
	options: {
		initialVisible?: boolean;
		options: { label: string; value: unknown }[];
	},
) => ({
	id,
	__type: FieldTypes.select,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__options: options?.options,
});

export const buildComboField = <S extends string>(
	id: S,
	value: string,
	operator: IIdentityOperator,
	options: {
		initialVisible?: boolean;
		options: { label: string; value: unknown }[];
		placeholder?: string;
	},
) => ({
	id,
	__type: FieldTypes.combobox,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__options: options?.options,
	__placeholder: options?.placeholder,
});

export const buildComboFieldAsync = <R extends Array<unknown>, S extends string>(
	id: S,
	value: string,
	operator: IIdentityOperator,
	options: {
		initialVisible?: boolean;
		placeholder?: string;
		resourceOptions:
			| HttpResourceOptions<R extends Array<infer U> ? U : R[], unknown>
			| Signal<HttpResourceOptions<R extends Array<infer U> ? U[] : R[], unknown>>;
		resourceRequest: HttpResourceRequest | Signal<HttpResourceRequest>;
		itemToString?: (item: R extends Array<infer U> ? U : R) => string;
	},
) => ({
	id,
	__type: FieldTypes.asyncCombobox,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__placeholder: options?.placeholder,
	__resourceOptions: options?.resourceOptions,
	__resourceRequest: options?.resourceRequest,
	__itemToString: options.itemToString ?? ((item: R extends Array<infer U> ? U : R) => String(item ?? '')),
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
		min?: number;
		max?: number;
	},
) => ({
	id,
	__type: FieldTypes.range,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__min: options?.min,
	__max: options?.max,
});

export const buildDateRangeField = <S extends string>(
	id: S,
	value: { start: Date; end: Date },
	operator: IOperator,
	options?: {
		initialVisible?: boolean;
		min?: Date;
		max?: Date;
	},
) => ({
	id,
	__type: FieldTypes.daterange,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__min: options?.min,
	__max: options?.max,
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
	[FieldTypes.asyncCombobox]: buildComboFieldAsync,
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
		_v.update((c) => {
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

	const fieldOperator = (fieldId: T[number]['id']): T[number]['operator'] => {
		const field = _v()[fieldId];
		return field.operator;
	};

	const fieldOptions = (fieldId: T[number]['id']): T[number] extends { __options: infer O } ? O : never => {
		const field = _v()[fieldId] as T[number] & { __options?: unknown };
		if (!field.__options) {
			throw new Error(`Field with id ${fieldId} does not have options`);
		}
		return field.__options as T[number] extends { __options: infer O } ? O : never;
	};

	const fieldNumericOptions = (
		fieldId: T[number]['id'],
	): { min: number | null; max: number | null; step: number | null } => {
		const field = _v()[fieldId] as T[number] & { __min?: unknown; __max?: unknown; __step?: unknown };
		if (field.__type !== FieldTypes.number) {
			return { min: null, max: null, step: null };
		} else {
			return {
				min: field.__min ?? null,
				max: field.__max ?? null,
				step: field.__step ?? null,
			};
		}
	};

	const fieldMinMax = <K extends IFieldType = IFieldType, MinMax = unknown>(
		fieldId: T[number]['id'],
	): MinMax extends { __type: K; __min: infer Min; __max: infer Max }
		? { min: Min; max: Max }
		: { min: null; max: null } => {
		const field = _v()[fieldId] as T[number] & { __min?: unknown; __max?: unknown };
		if (!('__min' in field) || !('__max' in field)) {
			return { min: null, max: null } as MinMax extends { __type: K; __min: infer Min; __max: infer Max }
				? { min: Min; max: Max }
				: { min: null; max: null };
		}
		return {
			min: field.__min,
			max: field.__max,
		} as MinMax extends { __type: K; __min: infer Min; __max: infer Max }
			? { min: Min; max: Max }
			: { min: null; max: null };
	};

	const fieldRequired = (fieldId: T[number]['id']): boolean => {
		const field = _v()[fieldId];
		// add other types as needed, for now only text fields can be required
		return field.__type === FieldTypes.text ? !!field.__required : false;
	};

	const fieldPlaceholder = <K = string>(fieldId: T[number]['id']): K => {
		const field = _v()[fieldId];
		if ('__placeholder' in field) {
			return field.__placeholder as K;
		} else {
			return _base[fieldId].value as K;
		}
	};

	const fieldResource = <R = unknown>(fieldId: T[number]['id']): ResourceRef<R> => {
		const field = _v()[fieldId] as T[number] & { __resourceRef?: ResourceRef<R> };
		if (!field.__resourceRef) {
			throw new Error(`Field with id ${fieldId} does not have a resource`);
		}
		return field.__resourceRef;
	};

	const fieldSearch = (fieldId: T[number]['id']): WritableSignal<string> => {
		const field = _v()[fieldId] as T[number] & { __search?: WritableSignal<string> };
		if (!field.__search) {
			throw new Error(`Field with id ${fieldId} does not have a search signal`);
		}
		return field.__search;
	};

	const fieldItemToString = <I = unknown>(fieldId: T[number]['id']): ((item: I) => string) => {
		const field = _v()[fieldId] as T[number] & { __itemToString?: (item: I) => string };
		return field.__itemToString ?? ((item: I) => String(item ?? ''));
	};

	const fieldResourceOptions = <R = unknown, K = unknown>(
		fieldId: T[number]['id']): HttpResourceOptions<R, K> | Signal<HttpResourceOptions<R, K>> => {
		const field = _v()[fieldId]
		if (field.__type !== FieldTypes.asyncCombobox) {
			throw new Error(`Field with id ${fieldId} is not an async combobox field`);
		}
		if (!field.__resourceOptions) {
			throw new Error(`Field with id ${fieldId} does not have resource options`);
		}
		return field.__resourceOptions as HttpResourceOptions<R, K> | Signal<HttpResourceOptions<R, K>>;
	}

	const fieldResourceRequest = (fieldId: T[number]['id']): HttpResourceRequest | Signal<HttpResourceRequest> => {
		const field = _v()[fieldId]
		if (field.__type !== FieldTypes.asyncCombobox) {
			throw new Error(`Field with id ${fieldId} is not an async combobox field`);
		}
		if (!field.__resourceRequest) {
			throw new Error(`Field with id ${fieldId} does not have a resource request`);
		}
		return field.__resourceRequest as HttpResourceRequest | Signal<HttpResourceRequest>;
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
		fieldOperator,
		fieldOptions,
		fieldNumericOptions,
		fieldMinMax,
		fieldRequired,
		fieldPlaceholder,
		fieldItemToString,
		fieldResourceOptions,
		fieldResourceRequest,
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
	fieldOperator(fieldId: TId): TFields['operator'];
	fieldOptions(fieldId: TId): TFields extends { __options: infer O } ? O : never;
	fieldNumericOptions(fieldId: TId): { min: number | null; max: number | null; step: number | null };
	fieldMinMax<K extends IFieldType = IFieldType, MinMax = unknown>(
		fieldId: TId,
	): MinMax extends { __type: K; __min: infer Min; __max: infer Max }
		? { min: Min; max: Max }
		: { min: null; max: null };
	fieldRequired(fieldId: TId): boolean;
	fieldPlaceholder<K = string>(fieldId: TId): K;
	fieldItemToString<I = unknown>(fieldId: TId): (item: I) => string;
	fieldResourceOptions<R = unknown[], K = unknown>(fieldId: TId): HttpResourceOptions<R, K> | Signal<HttpResourceOptions<R, K>>;
  fieldResourceRequest(fieldId: TId): HttpResourceRequest | Signal<HttpResourceRequest>;
}

// Infer exact type from a specific buildFilterModel call
export type InferFilterModel<T> =
	T extends FilterModelRef<infer TId, infer TFields> ? FilterModelRef<TId, TFields> : never;
