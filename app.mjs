import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// import "./db.mjs";
import cors from "cors";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// body parsing middleware
app.use(express.urlencoded({extended: false}));

// static file serving middleware
app.use(express.static(path.join(__dirname, "public")));

// middleware to allow cross-origin resource sharing so react can connect with express
app.use(cors()); 

// routing
app.get("/", (req, res) => {
    res.send("homepage vibes");
});
app.get("/test", (req, res) => {
    res.send("hi xD");
});

app.listen(process.env.PORT || 9000);