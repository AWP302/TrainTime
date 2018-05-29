

// 1. Initialize Firebase

var config = {
    apiKey: "AIzaSyCscahajJnMI6RMo5LSx4Gu5HZyq2pEfuU",
    authDomain: "train-schedule-19cce.firebaseapp.com",
    databaseURL: "https://train-schedule-19cce.firebaseio.com",
    projectId: "train-schedule-19cce",
    storageBucket: "",
    messagingSenderId: "63549151212"
  };

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainFirstTrainTime = moment($("#firstTrainTime-input").val().trim(), "HH:mm").format ("X");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    "name": trainName,
    "destination": trainDestination,
    "firstTrainTime": trainFirstTrainTime,
    "frequency": trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrainTime);
  console.log(newTrain.frequency);

  // Alert
  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstTrainTime-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainFirstTrainTime = childSnapshot.val().firstTrainTime;
  var trainFrequency = childSnapshot.val().frequency;

  // train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFirstTrainTime);
  console.log(trainFrequency);

  // Prettify the train firstTrainTime
  // var trainFirstTrainTimePretty = moment.unix(trainFirstTrainTime).format("MM/DD/YY");

  var trainFirstTrainTimeConverted = moment(trainFirstTrainTime, "HH:mm").subtract(1, "years");
  // console.log(trainFirstTrainTimeConverted);
  
  var currentTime = moment();
  // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
// Difference between the times
  var diffTime = moment().diff(moment(trainFirstTrainTimeConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
  var trainRemainder = diffTime % trainFrequency;
  // console.log(trainRemainder);

// Minute Until Train
  var trainMinutesTillTrain = trainFrequency - trainRemainder;
    // console.log("MINUTES TILL TRAIN: " + trainMinutesTillTrain);

// Next Train
  var nextTrain = moment().add(trainMinutesTillTrain, "minutes");
  // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td></tr>" + trainMinutesTillTrain);
});

