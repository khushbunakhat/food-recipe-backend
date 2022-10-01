const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require('./db/User');
const Recipe = require("./db/Recipe");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    resp.send(result)
})

app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            resp.send({ user })
        } else {
            resp.send({ result: "No User found" })
        };
    }
    else {
        resp.send({ result: "No User found" })
    }
});

app.post("/add-recipe", async (req, resp) => {
    let recipe = new Recipe(req.body);
    let result = await recipe.save();
    resp.send(result);
});

app.get("/recipes", async (req, resp) => {
    const recipes = await Recipe.find();
    if (recipes.length > 0) {
        resp.send(recipes)
    } else {
        resp.send({ result: "No recipes found" })
    }
});
app.put("/recipe/:id", async (req, resp) => {
    let result = await Recipe.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    resp.send(result)
});
app.delete("/recipe/:id", async (req, resp) => {
    let result = await Recipe.deleteOne({ _id: req.params.id });
    resp.send(result)
}),
    app.get("/recipe/:id", async (req, resp) => {
        let result = await Recipe.findOne({ _id: req.params.id })
        if (result) {
            resp.send(result)
        } else {
            resp.send({ "result": "No Record Found." })
        }
    })
app.get("/search/:key", async (req, resp) => {
    let result = await Recipe.find({
        "$or": [
            {
                label: { $regex: req.params.key }
            },
            {
                ingredients: { $regex: req.params.key }
            }
        ]
    });
    if (result) {
        resp.send(result)
    } else {
        resp.send({ "result": "No Record Found." })
    }

})

app.listen(5000, function () {
    console.log("Im listening at 5000");
});