import assert from 'assert';

export type Field = typeof HL7Nested | typeof String | typeof Number;

type FieldType<F extends Field> = F extends typeof String
  ? string
  : F extends typeof Number
  ? number
  : InstanceType<F>;

function periodCount(text: string): number {
  return text.split('.').length - 1;
}

const MAX_INDEX_DEPTH = 3;

export class HL7Nested {
  readonly data: object;

  constructor(
    data: object,
    public readonly fieldPrefix?: string,
    arrayIndex = 0,
  ) {
    if (Array.isArray(data)) {
      this.data = data[arrayIndex];
    } else {
      this.data = data;
    }
  }

  private accessor(index: string | number): string {
    return this.fieldPrefix === undefined
      ? index.toString()
      : `${this.fieldPrefix}.${index}`;
  }

  list<F extends Field>(cls: F, index: string | number): FieldType<F>[] {
    const data = this.data[this.accessor(index)];
    assert(Array.isArray(data));
    return data.map((_, arrayIndex) => this.field(cls, index, arrayIndex));
  }

  optionalField<F extends Field>(
    cls: F,
    index: string | number,
  ): FieldType<F> | undefined {
    const accessor = this.accessor(index);
    if (accessor in this.data) {
      return this.field(cls, index);
    } else {
      return undefined;
    }
  }

  field<F extends Field>(
    cls: F,
    index: string | number,
    arrayIndex?: number,
  ): FieldType<F> {
    const accessor = this.accessor(index);
    const data = this.data[accessor];
    if (cls == Number || cls == String) {
      const indexDepth = periodCount(accessor);
      if (indexDepth < MAX_INDEX_DEPTH) {
        assert(
          typeof data == 'object',
          `Expected object type at ${accessor} but got ${data}`,
        );
        return new HL7Nested(data, accessor, arrayIndex).field<F>(cls, 1);
      } else if (cls == Number) {
        assert(typeof data == 'string');
        return parseInt(data) as FieldType<F>;
      } else {
        assert(cls == String);
        assert(typeof data == 'string');
        return data as FieldType<F>;
      }
    } else {
      return new cls(data, accessor, arrayIndex) as FieldType<F>;
    }
  }

  asSimpleObject(): any {
    const result = {};
    for (const [k, v] of Object.entries(this)) {
      if (k !== 'data' && k !== 'fieldPrefix') {
        const convertValue = (v: any) => {
          if (v instanceof Array) {
            return v.map(convertValue);
          } else if (v instanceof HL7Nested) {
            return v.asSimpleObject();
          } else {
            return v;
          }
        };
        result[k] = convertValue(v);
      }
    }
    return result;
  }
}
