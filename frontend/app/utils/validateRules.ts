type Rule = (value?: any) => boolean | string;

const validateRules = (
  fields: Record<string, string | number | undefined>,
  rules: Record<string, Rule[]>,
): boolean => {
  return Object.keys(fields).every(
    (key) => rules[key]?.every((rule) => rule(fields[key]) === true) ?? false,
  );
};

export { validateRules };
