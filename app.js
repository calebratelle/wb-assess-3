import express from "express";
import session from "express-session";
import lodash from "lodash";
import morgan from "morgan";
import nunjucks from "nunjucks";
import ViteExpress from "vite-express";

const app = express();
const port = "8000";

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  session({ secret: "ssshhhhh", saveUninitialized: true, resave: false })
);

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

const MOST_LIKED_FOSSILS = {
  aust: {
    img: "/img/australopith.png",
    name: "Australopithecus",
    num_likes: 584,
  },
  quetz: {
    img: "/img/quetzal_torso.png",
    name: "Quetzal",
    num_likes: 587,
  },
  steg: {
    img: "/img/stego_skull.png",
    name: "Stegosaurus",
    num_likes: 598,
  },
  trex: {
    img: "/img/trex_skull.png",
    name: "Tyrannosaurus Rex",
    num_likes: 601,
  },
};

const OTHER_FOSSILS = [
  {
    img: "/img/ammonite.png",
    name: "Ammonite",
  },
  {
    img: "/img/mammoth_skull.png",
    name: "Mammoth",
  },
  {
    img: "/img/ophthalmo_skull.png",
    name: "Opthalmosaurus",
  },
  {
    img: "/img/tricera_skull.png",
    name: "Triceratops",
  },
];

app.get("/", (req, res) => {
  if (req.session.userName) {
    res.redirect("/top-fossils");
  } else {
    res.render("homepage.html.njk");
  }
});

app.get("/top-fossils", (req, res) => {
  if (req.session.userName) {
    res.render("top-fossils.html.njk", {
      fossils: MOST_LIKED_FOSSILS,
      userName: req.session.userName,
    });
  } else {
    res.redirect("/");
  }
});

app.get("/get-name", (req, res) => {
  const { name } = req.query;
  req.session.userName = name;
  res.redirect("/top-fossils");
});

app.get('/random-fossil.json', (req, res) => {
  const randomIndex = Math.floor(Math.random() * OTHER_FOSSILS.length);
  const randomFossil = OTHER_FOSSILS[randomIndex];
  res.json(randomFossil);
});


app.post("/like-fossil", (req, res) => {
  const { fossilId } = req.body;

  if (MOST_LIKED_FOSSILS.hasOwnProperty(fossilId)) {
    MOST_LIKED_FOSSILS[fossilId].num_likes++;

    const userName = req.session.userName || "Guest";
    const userFullName =
      userName === "Guest" ? "Guest" : "Thank you, " + userName;

    res.render("thank-you.html.njk", { userFullName });
  } else {
    res.redirect("/top-fossils");
  }
});

ViteExpress.listen(app, port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
