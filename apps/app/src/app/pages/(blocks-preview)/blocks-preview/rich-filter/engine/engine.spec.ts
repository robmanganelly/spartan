import { filterParser } from './parser';
import { buildFilterModel, buildNumberField, buildRangeField } from './builders';
import { EqualityOperators, Operators, TextOperators } from './operators';

// Inline a minimal buildTextField since it's not exported
const buildTextField = (
	id: string,
	value: string,
	operator: (typeof TextOperators)[keyof typeof TextOperators],
	options?: { initialVisible?: boolean; required?: boolean; placeholder?: string },
) => ({
	id,
	__type: 'text' as const,
	value,
	operator,
	__index: 0,
	__visible: !!options?.initialVisible,
	__required: !!options?.required,
	__placeholder: options?.placeholder,
});

describe('filterParser', () => {
	it('should strip private fields (those starting with __)', () => {
		const filter = buildFilterModel(
			buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: true }),
		);

		const parsed = filterParser(filter.value());
		const entry = parsed['name'];

		expect(entry).toBeDefined();
		expect(entry.id).toBe('name');
		expect(entry.value).toBe('Alice');
		expect(entry.operator).toBe(TextOperators.includes);

		// Ensure no private fields leak through
		expect(Object.keys(entry).some((k) => k.startsWith('__'))).toBe(false);
	});

	it('should exclude fields with null value', () => {
		const filter = buildFilterModel(
			buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: true }),
			buildNumberField('age', 0, EqualityOperators.equals, { initialVisible: true }),
		);
		// Set age value to null
		filter.patchFieldValue('age', null as unknown as number);

		const parsed = filterParser(filter.value());
		expect(parsed['name']).toBeDefined();
		expect(parsed['age']).toBeUndefined();
	});

	it('should exclude non-visible fields', () => {
		const filter = buildFilterModel(
			buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: true }),
			buildTextField('email', 'alice@example.com', TextOperators.includes, { initialVisible: false }),
		);

		const parsed = filterParser(filter.value());
		expect(parsed['name']).toBeDefined();
		expect(parsed['email']).toBeUndefined();
	});

	it('should return empty object when all fields are hidden', () => {
		const filter = buildFilterModel(
			buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: false }),
		);

		const parsed = filterParser(filter.value());
		expect(Object.keys(parsed)).toHaveLength(0);
	});

	it('should return empty object when all values are null', () => {
		const filter = buildFilterModel(
			buildTextField('name', '', TextOperators.includes, { initialVisible: true }),
		);
		filter.patchFieldValue('name', null as unknown as string);

		const parsed = filterParser(filter.value());
		expect(Object.keys(parsed)).toHaveLength(0);
	});

	it('should include fields with falsy but non-null values', () => {
		const filter = buildFilterModel(
			buildTextField('name', '', TextOperators.includes, { initialVisible: true }),
			buildNumberField('count', 0, EqualityOperators.equals, { initialVisible: true }),
		);

		const parsed = filterParser(filter.value());
		expect(parsed['name']).toBeDefined();
		expect(parsed['name'].value).toBe('');
		expect(parsed['count']).toBeDefined();
		expect(parsed['count'].value).toBe(0);
	});
});

describe('buildFilterModel', () => {
	const createTestModel = () =>
		buildFilterModel(
			buildTextField('name', 'Alice', TextOperators.includes, { initialVisible: true }),
			buildNumberField('age', 25, EqualityOperators.equals, { initialVisible: false }),
			buildRangeField('price', { min: 10, max: 100 }, Operators.between, { initialVisible: false }),
		);

	it('should create a model with correct initial values', () => {
		const model = createTestModel();
		expect(model.fieldValue('name')).toBe('Alice');
		expect(model.fieldValue('age')).toBe(25);
	});

	it('should return only visible fields in fieldsArray', () => {
		const model = createTestModel();
		const visible = model.fieldsArray();
		expect(visible).toHaveLength(1);
		expect(visible[0].id).toBe('name');
	});

	it('should return non-visible fields in availableFields', () => {
		const model = createTestModel();
		const available = model.availableFields();
		expect(available).toHaveLength(2);
		expect(available.map((f) => f.id)).toEqual(expect.arrayContaining(['age', 'price']));
	});

	describe('patchFieldValue', () => {
		it('should update a field value', () => {
			const model = createTestModel();
			model.patchFieldValue('name', 'Bob');
			expect(model.fieldValue('name')).toBe('Bob');
		});
	});

	describe('patchFieldOperator', () => {
		it('should update a field operator', () => {
			const model = createTestModel();
			model.patchFieldOperator('name', TextOperators.startsWith);
			expect(model.fieldOperator('name')).toBe(TextOperators.startsWith);
		});
	});

	describe('addField', () => {
		it('should make a hidden field visible', () => {
			const model = createTestModel();
			expect(model.fieldsArray().find((f) => f.id === 'age')).toBeUndefined();

			model.addField('age');

			expect(model.fieldsArray().find((f) => f.id === 'age')).toBeDefined();
		});

		it('should add field to end of visible list', () => {
			const model = createTestModel();
			model.addField('age');
			const arr = model.fieldsArray();
			expect(arr[arr.length - 1].id).toBe('age');
		});
	});

	describe('cleanField', () => {
		it('should hide a field and null its value', () => {
			const model = createTestModel();
			model.cleanField('name');

			const visible = model.fieldsArray();
			expect(visible.find((f) => f.id === 'name')).toBeUndefined();
			expect(model.fieldValue('name')).toBeNull();
		});
	});

	describe('clear', () => {
		it('should hide all fields', () => {
			const model = createTestModel();
			model.addField('age');
			expect(model.fieldsArray().length).toBeGreaterThan(0);

			model.clear();

			expect(model.fieldsArray()).toHaveLength(0);
		});
	});

	describe('reset', () => {
		it('should restore all fields to initial state', () => {
			const model = createTestModel();
			model.patchFieldValue('name', 'Changed');
			model.cleanField('name');

			model.reset();

			expect(model.fieldValue('name')).toBe('Alice');
			expect(model.fieldsArray().find((f) => f.id === 'name')).toBeDefined();
		});
	});

	describe('fieldNumericOptions', () => {
		it('should return min/max/step for number fields', () => {
			const model = buildFilterModel(
				buildNumberField('count', 5, EqualityOperators.equals, { min: 0, max: 100, step: 5 }),
			);
			const opts = model.fieldNumericOptions('count');
			expect(opts).toEqual({ min: 0, max: 100, step: 5 });
		});

		it('should return nulls for non-number fields', () => {
			const model = buildFilterModel(
				buildTextField('name', '', TextOperators.includes),
			);
			const opts = model.fieldNumericOptions('name');
			expect(opts).toEqual({ min: null, max: null, step: null });
		});
	});

	describe('fieldRequired', () => {
		it('should return true for required text fields', () => {
			const model = buildFilterModel(
				buildTextField('name', '', TextOperators.includes, { required: true }),
			);
			expect(model.fieldRequired('name')).toBe(true);
		});

		it('should return false for non-required fields', () => {
			const model = buildFilterModel(
				buildTextField('name', '', TextOperators.includes),
			);
			expect(model.fieldRequired('name')).toBe(false);
		});
	});
});
