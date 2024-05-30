export const isValidDate = (dateString) => {
    // Regex para verificar formato YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    // Verificar si la cadena coincide con el formato
    if (!regex.test(dateString)) return false;

    // Crear objeto Date a partir de la cadena
    const date = new Date(dateString);
    console.log(date);
    // Verificar si el objeto Date es válido
    const timestamp = date.getTime();
    console.log(timestamp);
    if (isNaN(timestamp)) return false;

    // Asegurarse de que la fecha convertida vuelva al formato original
    return date.toISOString().slice(0, 10) === dateString;
};

