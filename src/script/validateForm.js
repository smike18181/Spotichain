/**
 * Verifica se una stringa è una email valida.
 * @param {string} email - L'email da validare.
 * @returns {Object} - Restituisce un oggetto con un booleano `isValid` e un messaggio di errore, se presente.
 */
export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, message: 'L\'email non può essere vuota.' };
    }
    if (!email.includes('@')) {
        return { isValid: false, message: 'L\'email deve contenere il carattere @.' };
    }
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
        return { isValid: false, message: 'L\'email deve contenere una sola @.' };
    }
    if (!emailParts[1].includes('.')) {
        return { isValid: false, message: 'Il dominio dell\'email deve contenere un punto.' };
    }
    return { isValid: true, message: '' };
  };
  
  
  /**
  * Verifica se un nome è un nome proprio valido.
  * @param {string} name - Il nome da validare.
  * @returns {Object} - Restituisce un oggetto con un booleano `isValid` e un messaggio di errore, se presente.
  */
  export const validateProperName = (name) => {
    if (!name) {
        return { isValid: false, message: 'Il nome non può essere vuoto.' };
    }
    if (!/^[A-ZÀ-ÿ]/.test(name)) {
        return { isValid: false, message: 'Il nome deve iniziare con una lettera maiuscola.' };
    }
    if (!/^[A-Za-zÀ-ÿ]+$/.test(name)) {
        return { isValid: false, message: 'Il nome deve contenere solo lettere.' };
    }
    return { isValid: true, message: '' };
  };
  
  /**
  * Verifica se una descrizione è valida.
  * @param {string} description - La descrizione da validare.
  * @returns {Object} - Restituisce un oggetto con un booleano `isValid` e un messaggio di errore, se presente.
  */
  export const validateDescription = (description) => {
    if (!description) {
        return { isValid: false, message: 'La descrizione non può essere vuota.' };
    }
    if (!/^[A-Z]/.test(description)) {
        return { isValid: false, message: 'La descrizione deve iniziare con una lettera maiuscola.' };
    }
    if (!/^[A-Za-z0-9\s]*$/.test(description)) {
        return { isValid: false, message: 'La descrizione può contenere solo lettere, numeri e spazi.' };
    }
    return { isValid: true, message: '' };
  };
  