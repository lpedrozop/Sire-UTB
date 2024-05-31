import { fetchTokenInfo } from "./fetchTokenInfo";

export async function peticionForm(url, method, body = null) {
  try {
    const { secretParse } = await fetchTokenInfo();

    const headers = {
      Authorization: `Bearer ${secretParse.secret}`,
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: method,
      headers: headers,
    };

    if (body !== null) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      let errorMessage = `Error al realizar la solicitud: ${response.status}`;
      if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function descargarReportes(
  uri,
  method,
  body = null,
  nombreReporte
) {
  try {
    const { secretParse } = await fetchTokenInfo();

    const headers = {
      Authorization: `Bearer ${secretParse.secret}`,
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: method,
      headers: headers,
    };

    if (method !== "GET" && body !== null) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(
      `https://www.sire.software/admin/reporte/${uri}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Error al generar el reporte");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = nombreReporte;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
