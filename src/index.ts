import { app } from "./app.js";
import { connectDB } from "./lib/connection.js";


const port = parseInt(process.env.PORT || "5000", 10);

app.get("/health", (_, res): any => {
    return res.json({ message: "Healthy" })
})

connectDB().then(() => {
    app.listen(port, () => {
        console.log("Server started at http://localhost:%i", port);
    })
}).catch(err => console.log(err));