import {
    UpdateCorreoUser,
    getUserByNombre,
    insertUserMetadata,
    getCorreoUser
} from "../Models/ModelAzureToken.js";

export const IntroDataAzure = async (ID_Usuario, Nombre, Correo, Rol) => {

    const Correom = Correo.toLowerCase();
    // 1. Verificar si el Usuario ya existe
    const existingUser = await getUserByNombre(Nombre);
    // Si el usuario no existe, lo insertamos
    if (existingUser === null) {
        console.log("Usuario nuevo, insertando datos");
        const dataToInsert = {
            ID_Usuario: ID_Usuario,
            Nombre: Nombre,
            Correo: Correom,
            Rol: Rol
        };

        if(dataToInsert.Nombre === '' || dataToInsert.Correo === '' || dataToInsert.Rol === ''){
            console.log("Error al insertar datos");
            throw new Error('Error al insertar datos')
        }

        await insertUserMetadata(dataToInsert);
    }
    else {
        try {
            if (Rol.includes('Profesor') || Rol.includes('Aux_Administrativo') || Rol.includes('Administrador')) {
                const existingCorreo = await getCorreoUser(Correom);
                if (existingCorreo === null) {
                    console.log("Correo nuevo, insertando datos");
                    const dataToUpdate = {
                        Nombre: Nombre,
                        Correo: Correom
                    };

                    await UpdateCorreoUser(dataToUpdate);
                    console.log('Correo actualizado');
                } else {
                    console.log("Correo ya existente, no se insertan datos");
                }
            } else {
                console.log("Usuario ya existente, no se insertan datos");
            }
        }catch {
            console.log("Error al actualizar correo");

        }

    }

}
