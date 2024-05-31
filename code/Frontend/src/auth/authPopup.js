import * as msal from "@azure/msal-browser";
import { myMSALObj, loginRequest } from "./authConfig";
import { redireccionar } from "../utils/redireccionarRutas";

let username = "";

export function selectAccount() {
  const currentAccounts = myMSALObj.getAllAccounts();
  if (!currentAccounts || currentAccounts.length < 1) {
    return;
  } else if (currentAccounts.length > 1) {
    console.warn("Multiple accounts detected.");
  } else if (currentAccounts.length === 1) {
    username = currentAccounts[0].username;
  }
}

export function handleResponse(response) {
  if (response !== null) {
    username = response.account.username;
  } else {
    selectAccount();
  }
}

export function signIn() {
  myMSALObj
    .loginPopup({
      ...loginRequest,
      redirectUri: "/redirect",
    })
    .then(handleResponse)
    .catch((error) => {
      console.log(error);
    });
}

export async function getTokenPopup(request) {
  request.account = myMSALObj.getAccountByUsername(username);
  try {
    return await myMSALObj.acquireTokenSilent(request);
  } catch (error) {
    console.warn(error);
    console.warn("silent token acquisition fails. acquiring token using popup");
    if (error instanceof msal.InteractionRequiredAuthError) {
      return myMSALObj
        .acquireTokenPopup(request)
        .then((response) => {
          return response;
        })
        .catch((error_1) => {
          console.error(error_1);
        });
    } else {
      console.warn(error);
    }
  }
}

export function signOut() {
  const logoutRequest = {
    account: myMSALObj.getAccountByUsername(username),
  };
  myMSALObj.logoutPopup(logoutRequest).then(() => {
    window.location.reload();
  });

  localStorage.removeItem("access_token");
}

selectAccount();
