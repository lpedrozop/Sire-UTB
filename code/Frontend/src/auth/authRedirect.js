// authRedirect.js
import * as msal from "@azure/msal-browser";
import { myMSALObj, loginRequest } from "./authConfig";
import { redireccionar } from "../utils/redireccionarRutas";

let username = "";

myMSALObj
  .handleRedirectPromise()
  .then(handleResponse)
  .catch((error) => {
    console.error(error);
  });

function selectAccount(currentAccounts) {
  if (!currentAccounts) {
    return null;
  } else if (currentAccounts.length > 1) {
    console.warn("Multiple accounts detected.");
    return null;
  } else if (currentAccounts.length === 1) {
    return currentAccounts[0].username;
  }
}

export function handleResponse(response) {
  if (response !== null) {
    username = response.account.username;
    redireccionar("/dashboard");
  } else {
    const currentAccounts = myMSALObj.getAllAccounts();
    const selectedUsername = selectAccount(currentAccounts);
    if (selectedUsername !== null) {
      username = selectedUsername;
    } else {
      console.warn("No account selected.");
    }
  }
}

export function signIn() {
  myMSALObj.loginRedirect(loginRequest);
}

export async function getTokenRedirect(request) {
  request.account = myMSALObj.getAccountByUsername(username);
  return myMSALObj.acquireTokenSilent(request).catch((error) => {
    console.error(error);
    console.warn("silent token acquisition fails. acquiring token using popup");
    if (error instanceof msal.InteractionRequiredAuthError) {
      return myMSALObj.acquireTokenRedirect(request);
    } else {
      console.error(error);
    }
  });
}

export function signOut() {
  const logoutRequest = {
    account: myMSALObj.getAccountByUsername(username),
  };
  redireccionar("/");
  localStorage.removeItem("access_token");
  localStorage.removeItem("primer_paso");
  myMSALObj.logoutRedirect(logoutRequest);
}
