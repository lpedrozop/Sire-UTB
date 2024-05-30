import passport from 'passport';
import passportAzureAd from 'passport-azure-ad';
import authConfig from '../Config/authConfig.js';
import { IntroDataAzure } from "../Services/ProcessTokenServices.js";
import {ID_CLIENTE1, ID_CLIENTE2} from "../Config/Config.js";

const bearerStrategy = new passportAzureAd.BearerStrategy({
    identityMetadata: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}/${authConfig.metadata.discovery}`,
    issuer: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}`,
    clientID: authConfig.credentials.clientID,
    audience: authConfig.credentials.clientID,
    validateIssuer: authConfig.settings.validateIssuer,
    passReqToCallback: authConfig.settings.passReqToCallback,
    loggingLevel: authConfig.settings.loggingLevel,
    loggingNoPII: authConfig.settings.loggingNoPII,
}, async (req, token, done) => {

    const myAllowedClientsList = [ID_CLIENTE1, ID_CLIENTE2];

    if (!myAllowedClientsList.includes(token.azp)) {
        const errorMessage = `No Autorizado: Aplicación con Cliente ID '${token.azp}' no tiene permiso para acceder a los recursos.`;
        return done(new Error(errorMessage), {}, errorMessage);
    }

    if (!token.hasOwnProperty('scp') && !token.hasOwnProperty('roles')) {
        const errorMessage = "No autorizado: No cuenta con los permisos requeridos para acceder a este recurso.";
        return done(new Error(errorMessage), null, errorMessage);
    }

    await IntroDataAzure(token.oid, token.name, token.preferred_username, token.roles);

    return done(null, {}, token);
});

export function configure(passport) {
    passport.use(bearerStrategy);
}

// Middleware para autenticación con Azure AD
export const authenticateAzureAD = (req, res, next) => {
    passport.authenticate('oauth-bearer', {
        session: false
    }, (err, user, info) => {
        if (err) {
            console.error("Error de autenticación:", err.message);
            return res.status(401).json({ error: "Error de autenticación" });
        }

        if (!user) {
            return res.status(401).json({ error: "Acceso no autorizado" });
        }

        if (info) {
            req.authInfo = info;
            return next();
        }
    })(req, res, next);
};
