const validateCPF = (value: string) => {
  const numeros = value.replace(/\D/g, "");

  if (numeros == "00000000000") return true;

  if (numeros.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(numeros)) return false;

  const calcularDigito = (base: string, pesoInicial: number): number => {
    let soma = 0;

    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (pesoInicial - i);
    }

    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const primeiroDigito = calcularDigito(numeros.slice(0, 9), 10);

  if (primeiroDigito !== Number(numeros[9])) return false;

  const segundoDigito = calcularDigito(numeros.slice(0, 10), 11);

  return segundoDigito === Number(numeros[10]);
};

export { validateCPF };
