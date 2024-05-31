import * as msal from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "80ddcf29-3e47-4bae-9282-d9338060a5a5",
    authority:
      "https://login.microsoftonline.com/fc392005-78b3-4dc1-9257-ffbcff443b61",
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case msal.LogLevel.Error:
            console.error(message);
            return;
          case msal.LogLevel.Info:
            // console.info(message);
            return;
          case msal.LogLevel.Verbose:
            console.debug(message);
            return;
          case msal.LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

const protectedResources = {
  todolistApi: {
      endpoint: 'https://sire.software/form',
      scopes: {
          read: ['api://f928ab89-bd59-4400-8477-829e0cf9cc59/reservas.acceso']
      },
  },
};

export const loginRequest = {
  scopes: [...protectedResources.todolistApi.scopes.read],
};

export const myMSALObj = new msal.PublicClientApplication(msalConfig);

export async function getTokenPopup(request) {
  return myMSALObj.loginPopup({
    ...loginRequest,
    ...request,
    redirectUri: "/redirect",
  });
}

export async function getTokenRedirect(request) {
  return myMSALObj.loginRedirect({
    ...loginRequest,
    ...request,
    redirectUri: "/redirect",
  });
}

export function isAuth() {
  const accounts = myMSALObj.getAllAccounts();
  return accounts && accounts.length > 0;
}
