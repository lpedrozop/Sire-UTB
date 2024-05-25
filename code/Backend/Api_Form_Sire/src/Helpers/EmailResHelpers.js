export function HtmlModificado(htmlContent, valores) {
    let contenidoModificado = htmlContent;
    for (const marcador in valores) {
        const expresionRegular = new RegExp(`\\[${marcador}\\]`, 'g');
        contenidoModificado = contenidoModificado.replace(expresionRegular, valores[marcador]);
    }
    return contenidoModificado;
}