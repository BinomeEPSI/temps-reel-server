// TESTS 
var user1 = "20835";
var user2 = "16776";

var api = new API();
api.setUser(user1);

// api.sendMessage(function (data) {
//     console.info("Send 'Test !' to " + user2);
//     console.log(data);
// }, user1, "Test !");

// api.getMessage();

// api.addEventListener("messageReceived", function(e) {
//     console.info("Message received ! ")
//     console.log(e.detail);
//     api.getMessage();
// })

// api.ping(function (results, now) {
//     console.log(results, now);
//     var delta = ( (results.t1 - results.t0) + (results.t2 - now) ) / 2
//     console.log(delta);
// })

api.delete(function (data) {
    console.log(data);
})
