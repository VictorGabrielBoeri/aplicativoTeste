/**
 * Formata um número de telefone para o formato brasileiro
 * @param phone Número de telefone a ser formatado
 * @returns Número de telefone formatado
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(
      2,
      7,
    )}-${cleaned.substring(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(
      2,
      6,
    )}-${cleaned.substring(6)}`;
  }

  return phone;
};

/**
 * Formata um endereço completo
 * @param street Rua
 * @param city Cidade
 * @param zipcode CEP
 * @returns Endereço formatado
 */
export const formatAddress = (
  street: string,
  city: string,
  zipcode: string,
): string => {
  return `${street}, ${city} - CEP: ${zipcode}`;
};

/**
 * Formata a primeira letra de cada palavra em maiúscula
 * @param text Texto a ser formatado
 * @returns Texto formatado
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
