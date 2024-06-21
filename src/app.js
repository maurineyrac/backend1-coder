import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./dirname.js";

import indexRoutes from "./routes/index.routes.js";
import viewsRoutes from './routes/views.routes.js'
import { Server } from "socket.io";
import { connectMongoDB } from "./config/mongoDB.config.js";

// Configuracion de express
const PORT = 8080;
const app = express();

connectMongoDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Middleware para compartir io con las rutas
app.use((req, res, next) => {
    req.io = socketServer;
    next();
});

//Routes
app.use("/api", indexRoutes);
app.use("/", viewsRoutes);


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
});

export const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    
    console.log("Nuevo cliente conectado!");
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});
