import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import {authenticateAzureAD, configure} from './Middleware/AuthMiddleware.js';
import userRouter from "./Routes/ReservaRoutes.js";
import passport from 'passport';
import {ENDPOINT_API} from "./Config/Config.js";

const app = express();

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(passport.initialize());
configure(passport); // Configurar el middleware de autenticación
app.use(ENDPOINT_API, authenticateAzureAD, userRouter);
app.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    const status = err.status || 500;
    const errorMessage = err.message || 'Ha ocurrido un error en el servidor.';

    res.status(status).json({
        error: {
            message: errorMessage
        }
    });
});

export default app;