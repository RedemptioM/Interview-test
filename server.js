const express = require("express");

const app = express();

let counter = 0;
const timeArr = [];
let startTime = false;
let addTime;
let newAddTime;
let aveTime;

app.get("/getCounter", (req, res) => {
  if (startTime && addTime) {
    aveTime = timeArr.reduce((total, cur) => total + cur) / timeArr.length;
    console.log(aveTime);
    startTime = false;
    addTime = false;
    return res.json({
      Result:
        "You have got the predicted time, please send GET request to '/predict' to check the result."
    });
  } else if (startTime && !addTime) {
    return res
      .status(400)
      .json({
        error:
          "You should send some POST requests to '/addCounter' before send GET request to this url again."
      });
  }
  startTime = new Date().getTime();
  console.log(startTime);
  res.json({
    timeStamp: startTime,
    date: new Date(),
    counter: counter
  });
});

app.post("/addCounter", (req, res) => {
  if (!startTime && !addTime) {
    return res
      .status(400)
      .json({ error: "You need to send GET request to '/getCounter' first." });
  } else if (!startTime && addTime) {
    return res
      .status(400)
      .json({ error: "You need to get count number first." });
  } else if (startTime && !addTime) {
    addTime = new Date().getTime();
    console.log(addTime);
    let interval = parseInt((addTime - startTime) / 1000);
    timeArr.push(interval);
    console.log(timeArr);
  } else if (startTime && addTime) {
    newAddTime = new Date().getTime();
    console.log(newAddTime);
    let interval = parseInt((newAddTime - addTime) / 1000);
    timeArr.push(interval);
    addTime = newAddTime;
    console.log(timeArr);
  }

  counter++;
  res.json({
    timeStamp: new Date().getTime(),
    date: new Date(),
    counter: counter
  });
});

app.get("/predict", (req, res) => {
  if (!aveTime) {
    res.status(400).json({
      error:
        "You need to send GET request to '/getCounter' double times before predict."
    });
  }
  let resultByTimestamp = new Date().getTime() + Math.floor(aveTime * 1000);

  let resultByString =
    new Date().toString() +
    " + " +
    (Math.floor(aveTime * 100) / 100).toString() +
    " seconds";

  return res.json({
    resultByTimestamp: resultByTimestamp,
    resultByString: resultByString
  });
});

app.listen(8080, () => console.log("Server running on port 8080"));
