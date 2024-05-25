import {TENANTID, CLIENTID, ENDPOINT_API, DELEGATED_PERMISSIONS_API} from "./Config.js"

const passportConfig = {
    credentials: {
        tenantID: TENANTID,
        clientID: CLIENTID
    },
    metadata: {
        authority: "login.microsoftonline.com",
        discovery: ".well-known/openid-configuration",
        version: "v2.0"
    },
    settings: {
        validateIssuer: true,
        passReqToCallback: true,
        loggingLevel: "info",
        loggingNoPII: true,
    },
    protectedRoutes: {
        reserva: {
            endpoint:ENDPOINT_API,
            delegatedPermissions: {
                access: [DELEGATED_PERMISSIONS_API]
            }
        }
    }
}

export default passportConfig;
