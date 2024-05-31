export function decodeToken(token) {
  const parts = token.split(".");

  const decodedHeader = JSON.parse(atob(parts[0]));
  const decodedPayload = JSON.parse(atob(parts[1]));

  const decodedToken = {
    header: decodedHeader,
    payload: decodedPayload,
  };

  return decodedToken;
}
