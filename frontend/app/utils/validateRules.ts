interface Field {
  value?: string;
  rules: ((value?: string) => boolean | string)[];
}

const validateRules = (fields: Field[]): boolean => {
  return fields.every((field) =>
    field.rules.every((rule) => rule(field.value) === true),
  );
};

export { validateRules };
