const validatePassword = (value: string) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

  return regex.test(value);
};

export { validatePassword };
