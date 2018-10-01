var user1 = "20835";
var user2 = "16776";
var buttons = document.getElementsByClassName('button-users');
api.setUser(user1);

api.ping(function (results, now) {
    var delta = ((results.t1 - results.t0) + (results.t2 - now)) / 2
    document.getElementById("ping").innerHTML = "Ping: " + delta + " ms";
    api.setDelta(delta);
})

function initSelect(data) {
    console.info("Get players");

    var noValue = document.createElement("option");
    noValue.innerHTML = "Veuillez choisir";
    noValue.value = -1;
    var noValue2 = noValue.cloneNode(true)
    var select1 = document.getElementById("user1")
    var select2 = document.getElementById("user2")
    select1.appendChild(noValue)
    select2.appendChild(noValue2)

    data.forEach(element => {
        var option1 = document.createElement('option');
        option1.value = element.id
        option1.title = element.name
        option1.innerHTML = element.name
        var option2 = option1.cloneNode(true);

        if (user1 == element.id || user2 == element.id) {
            select1.prepend(option1)
            select2.prepend(option2)
        } else {
            select1.appendChild(option1)
            select2.appendChild(option2)
        }

    });

    select1.addEventListener('change', handleUserSelect);
    select2.disabled = true
    select2.addEventListener('change', handleOpponentSelect);
}

api.getPlayers(function (data) {
    data.sort(function (a, b) {
        return a.name - b.name;
    })

    initSelect(data)
});

function handleUserSelect(event) {
    var selectedOption = event.target.options[event.target.selectedIndex];
    console.info("You are playing as " + selectedOption.innerHTML);
    if (selectedOption.value != -1) {
        api.setUser(selectedOption.value)
        api.getMessage();
        event.target.disabled = true;
        document.getElementById("user2").disabled = false
    }
}

function handleOpponentSelect(event) {
    var selectedOption = event.target.options[event.target.selectedIndex];
    console.info(selectedOption.innerHTML + " is your opponent, going to tell him.");
    if (selectedOption.value != -1) {
        api.setOpponent(selectedOption.value)
        event.target.disabled = true;
        startMsg()
    }
}

function startMsg() {
    api.sendMessage(function (data) {
        console.info("your opponent has been told to play !");
        console.log(data)
    }, api.opponent, "start")
}
