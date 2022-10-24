import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "./db.mjs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine - __TODO__ I don't plan to use templating in my final project because I want to use React
app.set("view engine", "hbs");

// body parsing middleware
app.use(express.urlencoded({extended: false}));

// static file serving middleware
app.use(express.static(path.join(__dirname, "public")));

// routing
app.get("/", (req, res) => {
    res.render("index");
});

app.listen(process.env.PORT || 3000);