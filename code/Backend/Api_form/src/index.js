
import {PORT} from "./Config/Config.js";
import app from "./app.js"

app.listen(PORT, () => {
    console.log('servidor listo', PORT);
});