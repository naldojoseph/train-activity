$(document).ready(function () {

    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDN3Emc7pbWSX1xvNa9alpt3V2B7mZn6pw",
      authDomain: "click-activities.firebaseapp.com",
      databaseURL: "https://click-activities.firebaseio.com",
      projectId: "click-activities",
      storageBucket: "click-activities.appspot.com",
      messagingSenderId: "145478211073",
      appId: "1:145478211073:web:25d55dabb84c354e"
    };
    
    firebase.initializeApp(firebaseConfig);
  
    var database = firebase.database();
  
    // capture button click
    $("#addTrain").on("click", function (event) {
      event.preventDefault();
  
      // get values from text boxes
      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val().trim();
      var freq = $("#frequency").val().trim();
  
      // handle the push
      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: freq
      });
    });
  
  
    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    database.ref().on("child_added", function (childSnapshot) {
  
      var newTrain = childSnapshot.val().trainName;
      var newLocation = childSnapshot.val().destination;
      var newFirstTrain = childSnapshot.val().firstTrain;
      var newFreq = childSnapshot.val().frequency;
  
      // First Time (pushed back 1 year to make sure it comes before current time)
      var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");
  
      // Current Time
      var currentTime = moment();
  
      // Difference between the times
      var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  
      // Time apart (remainder)
      var tRemainder = diffTime % newFreq;
  
      // Minute(s) Until Train
      var tMinutesTillTrain = newFreq - tRemainder;
  
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      var catchTrain = moment(nextTrain).format("HH:mm");
  
      // Display On Page
      $("#all-display").append(
        ' <tr><td>' + newTrain +
        ' </td><td>' + newLocation +
        ' </td><td>' + newFreq +
        ' </td><td>' + catchTrain +
        ' </td><td>' + tMinutesTillTrain + ' </td></tr>');

      // Clear input fields
      $("#trainName, #destination, #firstTrain, #interval").val("");
      return false;

      
    },
     //Handle the errors
      function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
    
  
  });