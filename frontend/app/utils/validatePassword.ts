const validatePassword = (value: string) => {
  if (!value || value.length == 0) return true;

  const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

  return regex.test(value);
};

export { validatePassword };
