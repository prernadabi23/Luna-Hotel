const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine' , 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://0.0.0.0:27017/hotelDB", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const reservationSchema = {
  name: String,
  email: String,
  subject: String,
  message: String
};

const Reservation = mongoose.model("Reservation", reservationSchema);


app.get("/", function(req, res){
  Reservation.find({}, function(err, reservations) {
    res.render("home", {
      reservations : reservations
    });
  });
});

app.get("/book", function(req, res){
  res.render("book");
});

app.post("/book", function(req, res) {
  const reservation = new Reservation({
    name: req.body.reservationName,
    email: req.body.reservationEmail,
    subject: req.body.reservationSubject,
    message: req.body.reservationBody
  });

  reservation.save(function(err) {
    if(!err) {
      res.redirect("/")
    } else {
      console.log(err);
    }
  });
});

app.get("/reservations/:reservationId", function(req, res){
  const requestedReservationId = req.params.reservationId;

  Reservation.findOne({_id: requestedReservationId}, function(err, reservation){
    res.render("reservation", {
      name: reservation.name,
      email: reservation.email,
      subject: reservation.subject,
      message: reservation.message
    });
  });
});

app.post("/", function(req, res){
  const email = req.body.email;
  // console.log(email);
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/56fa24bc13";

  const options = {
    method : "POST",
    auth: "prerna24:28a311478f3fe53e7f38eaeadce35d53-us21"
  }

    const request =  https.request(url, options, function(response) {

    if(response.statusCode === 200) {
      res.render("success");
    } else {
      res.render("failure");
    }

     response.on("data", function(data) {
       console.log(JSON.parse(data));
     });
  });

   request.write(jsonData);
   request.end();

});

app.post("/failure" , function(req,res){
  res.redirect("/");
});

app.get("/career", function(req, res){
  res.render("career");
});

// app.get("/book", function(req, res){
//   res.render("book");
// });

app.get("/menu", function(req, res){
  res.render("menu");
});

app.get("/blog", function(req, res) {
  res.render("blog");
});

// app.get("/reservation", function(req, res){
//   res.render("reservation");
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/accomodation", function(req, res){
  res.render("accomodation");
});

app.get("/dining", function(req, res){
  res.render("dining");
});

app.get("/events", function(req, res){
  res.render("events");
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});




// Api keys
// 28a311478f3fe53e7f38eaeadce35d53-us21

// unique keys
// 56fa24bc13
