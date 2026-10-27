type Rule = (value?: string) => boolean | string;

const validateRules = (
  fields: Record<string, string | undefined>,
  rules: Record<string, Rule[]>,
): boolean => {
  return Object.keys(fields).every(
    (key) => rules[key]?.every((rule) => rule(fields[key]) === true) ?? false,
  );
};

export { validateRules };
