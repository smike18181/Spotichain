import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';

function Form({ jsonFields }) {

  const { setFormData, handle } = useContext(ApiContext);

  // Funzione per aggiornare lo stato del modulo (gestisce anche i file)
  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;

    // Se l'input è di tipo file, gestisci i file (audio o immagini)
    if (type === 'file') {
      const file = files[0]; // Prendi il primo file selezionato
      if (file) {
        // Aggiungi il file al formData
        setFormData((prevData) => ({
          ...prevData,
          [name]: file, // Aggiungi il file al formData
        }));
      }
    } else {
      // Gestisci i cambiamenti di valore per gli altri tipi di input
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <form style={styles.form}>
      {jsonFields.map((field, index) => (
        <div key={index} style={styles.fieldContainer}>
          <label htmlFor={field.name} style={styles.label}>{field.label || field.name}</label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              rows={field.rows || 4}
              placeholder={field.placeholder || ''}
              style={styles.textarea}
              onChange={handleInputChange}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              style={styles.select}
              onChange={handleInputChange}
            >
              {field.options && field.options.map((option, idx) => (
                <option key={idx} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              accept={field.accept}
              placeholder={field.placeholder || ''}
              style={styles.input}
              onChange={handleInputChange}
            />
          )}
        </div>
      ))}
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#333',
    boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.05)', // Ombra biancastra morbida
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#ccc',
  },
  input: {
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #444',
    borderRadius: '4px',
  },
  textarea: {
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
  },
  select: {
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
};

export default Form;
