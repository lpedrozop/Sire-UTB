export async function fetchTokenInfo() {
  try {
    const sessionToken = sessionStorage.getItem("msal.account.keys");

    if (sessionToken) {
      const tokenObject = JSON.parse(sessionToken)[0];

      try {
        const tokenUid = sessionStorage.getItem(tokenObject);
        const response = JSON.parse(tokenUid);
        const idToken = response.idTokenClaims.aud;

        const combinedToken = `msal.token.keys.${idToken}`;
        const accessTokenPeticion = sessionStorage.getItem(combinedToken);
        const tokenParse = JSON.parse(accessTokenPeticion);
        const secretKey = sessionStorage.getItem(tokenParse.accessToken);
        const secretParse = JSON.parse(secretKey);

        return { response, secretParse };
      } catch (error) {
        console.error("Error al parsear el token de acceso:", error);
        throw error;
      }
    } else {
      console.log("No se encontró el token en el almacenamiento de sesión");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    throw error;
  }
}
