import {config} from "dotenv";

config();
export const PORT = process.env.PORT
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_HOST = process.env.DB_HOST
export const DB_DATABASE = process.env.DB_DATABASE
export const DB_PORT = process.env.DB_PORT
export const TENANTID = process.env.TENANTID
export const CLIENTID = process.env.CLIENTID
export const ID_CLIENTE1 = process.env.ID_CLIENTE1
export const ID_CLIENTE2 = process.env.ID_CLIENTE2
export const ENDPOINT_API = process.env.ENDPOINT_API
export const DELEGATED_PERMISSIONS_API = process.env.DELEGATED_PERMISSIONS_API
export const RESENDGRID_API_KEY = process.env.RESENDGRID_API_KEY
export const CORREO_NOTI = process.env.CORREO_NOTI


