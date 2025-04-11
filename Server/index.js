const express = require("express");
const cors = require("cors");
const { askGemini } = require("./persona.js");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
    try {
        console.log(req.body.message)
        const response = await askGemini(req.body.message);
        console.log(response);
        return res.status(200).json({
            success: true,
            data: response,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gemini API failed" });
    }
});

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});

app.get("/", (req, res) => {
    res.send("Gemini API Server");
})  