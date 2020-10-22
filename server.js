const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const logger = require("morgan");
const db = require("./models");
const { Workout } = require("./models");
const { userInfo } = require("os");

const app = express();

app.use(logger("dev"));

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dbExample", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//API Routes

// POST /api/workouts
// PUT /api/workouts/:id
// GET /api/workouts/range
app.get("/api/workouts", (req, res) => {
    db.Workout.find({}).sort({day: -1}).limit(1)
    .then(data => {
        console.log("%%%%")
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        res.json(err)
    })
})

app.post("/api/workouts", ({ body }, res) => {
    const newWorkout = new Workout(body);
    console.log(newWorkout);
    db.Workout.create(newWorkout)
        .then(data => {
            console.log("~~~")
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        })
})

app.put("/api/workouts/:id", ({body}, res) => {
    db.Workout.create(body)
    .then(({_id}) => db.Workout.findOneAndUpdate({}, { $push: {exercises: _id}},{ new: true}))
    .then(data => {
        console.log("***")
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        res.json(err);
    })
})

app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({}).sort({ day: -1}).limit(7)
    .then(data => {
        console.log("!!!")
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        res.json(err)
    })
})


// HTML Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "public/exercise.html"))
})

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "public/stats.html"))
})

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})