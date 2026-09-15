const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const Place = require("./models/place")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync")
const placeSchema = require("./schima.js")
const reviewSchema = require("./models/review");
const Review = require("./models/review");

//mongo URI
const MONGO_URI = 'mongodb://127.0.0.1:27017/bookme'
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

main()
    .then((res) => {
        console.log("MongoDB is Connected");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URI);
}
// app.get("/places", async(req, res) => {
//     let place = new Place({
//         title: "NOVA",
//         description : "abcd abcd",
//         price:1999,
//         location:"Golaghat",
//         country:"INDIA"
//     })
//     await place.save();
//     res.send("Data was Sved")
// })
app.get("/places/new", wrapAsync(async (req, res) => {
    res.render("place/create.ejs")
})
)
app.get("/place", async (req, res) => {
    let places = await Place.find()
    // console.log(places)
    res.render("place/index.ejs", { places })
})

app.get("/places/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id).populate("reviews");
    if (!place) {
        return res.status(404).send("Place not found");
    }
    res.render("place/show.ejs", { place });
}));

app.post("/places", async (req, res, next) => {
    try {
        let place = new Place(req.body.place);
        await place.save();
        let result = placeSchema.validate(place);
        if (!result.error) {
            res.send("server side validation error")
        }
        res.redirect("/place")
    } catch (error) {
        next(error)

    }
})

app.get("/place/:id/edit", async (req, res) => {
    let { id } = req.params;
    let place = await Place.findById(id);
    res.render("place/edit", { place })
})
app.put("/places/:id", async (req, res) => {
    let { id } = req.params;
    let place = await Place.findByIdAndUpdate(id, { ...req.body.place })
    res.redirect(`/places/${id}`)
})

app.delete("/place/:id", async (req, res) => {
    let { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect("/place")
})


app.post("/place/:id/review", async (req, res) => {
    let { id } = req.params;
    let place = await Place.findById(id);
    let review = new Review(req.body.review)
    review.push(review)
    await place.save()
    res.redirect(`/place/${id}`)
})
app.get("/", (req, res) => {
    res.send("API running.......")
})

app.post("/places/:id/reviews", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
        return res.status(404).send("Place not found");
    }
    
    const newReview = new Review(req.body.review);
    place.reviews.push(newReview);
    
    await newReview.save();
    await place.save();
    
    res.redirect(`/places/${id}`);
}));
    app.get("/", (req, res) => {
        res.send("API running.......")
    })

    app.all("*any", (req, res, next) => {
        res.status(404).send("page not found")
    })
    // app.use((err, req, res, next) => {
    //     res.send("Internal Server Error")
    // })

    app.listen(port, () => {
        console.log(`server running on port ${port}`)
    })