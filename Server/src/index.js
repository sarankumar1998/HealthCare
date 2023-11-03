var express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const doctors = require("./authorization/DoctorsAuth")
const patients = require("./authorization/PatientAuth")
const doctorAvail = require("./DoctorAPI/DoctorAvailability/DoctorAvailability")
const cors = require("cors");
const helmet = require('helmet');

var app = express();

const corsOptions = {
  origin: ['http://localhost:3001', 'http://192.168.10.117:3001'] // Add your frontend's origins
};

app.use(cors(corsOptions));
app.use(helmet({ referrerPolicy: { policy: 'same-origin' } }));

app.use(express.json());
app.use(bodyParser.json());
app.use("/api/v1", doctors);
app.use("/api/v2", patients);
app.use("/api/v3", doctorAvail);


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cookieParser());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
