const parseDate = (date: string) => {
  return date.split("-").reverse().join("/");
};

export { parseDate };
