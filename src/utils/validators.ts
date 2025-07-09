/**
 * Valida um endereço de e-mail
 * @param email E-mail a ser validado
 * @returns true se o e-mail for válido, false caso contrário
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida um número de telefone
 * @param phone Número de telefone a ser validado
 * @returns true se o telefone for válido, false caso contrário
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');

  return cleaned.length >= 10 && cleaned.length <= 11;
};

/**
 * Valida se um texto não está vazio
 * @param text Texto a ser validado
 * @returns true se o texto não estiver vazio, false caso contrário
 */
export const isNotEmpty = (text: string): boolean => {
  return text.trim().length > 0;
};

/**
 * Valida se um objeto cliente tem todos os campos obrigatórios
 * @param client Objeto cliente a ser validado
 * @returns true se o cliente for válido, false caso contrário
 */
export const isValidClient = (client: any): boolean => {
  return (
    client &&
    isNotEmpty(client.name) &&
    isValidEmail(client.email) &&
    isValidPhone(client.phone) &&
    client.address &&
    isNotEmpty(client.address.street) &&
    isNotEmpty(client.address.city) &&
    isNotEmpty(client.address.zipcode)
  );
};

/**
 * Valida credenciais de login
 * @param username Nome de usuário
 * @param password Senha
 * @returns true se ambos não estiverem vazios
 */
export const isValidCredentials = (
  username: string,
  password: string,
): boolean => {
  return isNotEmpty(username) && isNotEmpty(password);
};

/**
 * Valida dados de registro de usuário
 * @param userData Dados do usuário
 * @returns true se todos os campos obrigatórios estiverem preenchidos
 */
export const isValidUserRegistration = (userData: any): boolean => {
  return (
    userData &&
    isNotEmpty(userData.username) &&
    isNotEmpty(userData.password) &&
    isNotEmpty(userData.name) &&
    isValidEmail(userData.email)
  );
};
