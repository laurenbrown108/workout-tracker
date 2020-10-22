const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const logger = require("morgan");
const db = require("./models");
const { Workout } = require("./models");

const app = express();

app.use(logger("dev"));

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//API Routes

app.get("/api/workouts", (req, res) => {
    Workout.find({}).sort({ day: -1 }).limit(1)
        .then(data => {
            console.log(data);
            data.map(workoutData => {
                let time = 0;
                workoutData.exercises.map(all => {
                    time += all.duration
                })
                workoutData.totalDuration = time;
            })
            res.json(data);
        })
        .catch(err => {
            res.json(err)
        })
})

app.get("/api/workouts/range", (req, res) => {
    Workout.find({}).limit(7)
        .then(data => {
            console.log("!!!")
            res.json(data);
        })
        .catch(err => {
            res.json(err)
        })
})

app.post("/api/workouts", (req, res) => {

    Workout.create(req.body)
        .then(data => {
            console.log("~~~")
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        })
})


app.put("/api/workouts/:id", (req, res) => {
    Workout.findByIdAndUpdate(req.params.id, { $push: { exercises: req.body }}, { new: true })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json(err)
        });
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