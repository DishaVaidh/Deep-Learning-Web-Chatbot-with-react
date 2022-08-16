const express = require("express");
const app = express();
const cors = require("cors");
var MongoClient = require("mongodb").MongoClient;
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.get("/", function func(req, res) {
  res.send("Hello");
});

app.get("/get", getMessage);
function getMessage(req, res) {
  var spawn = require("child_process").spawn;
  var process = spawn("python", ["./getMsg.py", req.query.msg]);
  process.stdout.on("data", function (data) {
    res.send(data.toString());
  });
}

app.get("/getData", getSuggestion);
async function getSuggestion(req, res) {
  var data1 = [];
  MongoClient.connect("mongodb://localhost:27017/", async (err, databases) => {
    if (err) {
      throw err;
    }
    var DB = databases.db("React_Chatbot_db");
    var collection = DB.collection("test");
    await collection.findOne().then(function (intents) {
      //console.log(intents);
      for (let ind in intents["intents"]) {
        //console.log(intents["intents"][ind]);
        let intent = intents["intents"][ind];
        for (let ind2 in intent["patterns"]) {
          //console.log(intent["patterns"][ind2]);
          let pattern = intent["patterns"][ind2];
          //console.log(pattern);
          data1.push(pattern);
        }
        //console.log(data1);
      }
      res.send({ data: data1 });
    });
  });
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
