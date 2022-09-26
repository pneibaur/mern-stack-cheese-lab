//////////////////////////////////
////////// DEPENDENCIES
//////////////////////////////////
require("dotenv").config()
const {PORT=4000, MONGODB_URL} = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

//////////////////////////////////
////////// DATABASE CONNECTION
//////////////////////////////////
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true, 
    useNewUrlParser: true,
})
mongoose.connection.on("open", ()=> console.log("Connected to Mongoose"))
mongoose.connection.on("close", ()=> console.log("Disconnected from Mongoose"))
mongoose.connection.on("error", (error)=> console.log(error, "Is Mongoose not running?"))

//////////////////////////////////
////////// MODELS
//////////////////////////////////
const CheeseSchema = new mongoose.Schema(
    {
        name: String,
        countryOfOrigin: String,
        image: String
    }
)
const Cheese = mongoose.model("Cheese", CheeseSchema)

//////////////////////////////////
////////// MIDDLEWARE
//////////////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

//////////////////////////////////
////////// ROUTES
//////////////////////////////////
app.get("/", (req, res)=>{
    res.send("HELLO THERE!")
})

// INDEX cheese route
app.get("/cheese", async(req, res) => {
    try {
        res.json(await Cheese.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// NEW cheese route
app.post("/cheese", async(req, res)=>{
    try {
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// DELETE cheese route
app.delete("/cheese/:id", async(req, res)=>{
    try {
        res.json(await Cheese.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

// UPDATE cheese
app.put("/cheese/:id", async(req, res) =>{
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.get("/cheese/:id", async(req, res) =>{
    try {
        res.json(await Cheese.findById(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

//////////////////////////////////
////////// LISTENER
//////////////////////////////////
app.listen(PORT, ()=> console.log(`listening on port ${PORT}`))