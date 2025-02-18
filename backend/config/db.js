// const mongoose = require("mongoose");

// //atlas - mongodb+srv://gabru:722877hh@cluster0.uoy47wh.mongodb.net/?retryWrites=true&w=majority
// //compass- mongodb://localhost:27017/traffino1

// mongoose
//   .connect(
//     "mongodb://localhost:27017/traffino"
//   )
//   .then(() => {
//     console.log("connextion successful");

//   })
//   .catch((err) => {
//     console.log(err.message);
//   });
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/tclraffino", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });
