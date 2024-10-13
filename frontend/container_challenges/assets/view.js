CTFd._internal.challenge.data = undefined;

CTFd._internal.challenge.renderer = null;

CTFd._internal.challenge.preRender = function() {};

CTFd._internal.challenge.render = null;

CTFd._internal.challenge.postRender = function() {};

CTFd._internal.challenge.submit = function(preview) {
  var challenge_id = parseInt(CTFd.lib.$("#challenge-id").val());
  var submission = CTFd.lib.$("#challenge-input").val();

  var body = {
    challenge_id: challenge_id,
    submission: submission
  };
  var params = {};
  if (preview) {
    params["preview"] = true;
  }

  return CTFd.api.post_challenge_attempt(params, body).then(function(response) {
    if (response.status === 429) {
      // User was ratelimited but process response
      return response;
    }
    if (response.status === 403) {
      // User is not logged in or CTF is paused.
      return response;
    }
    return response;
  });
};

CTFd.plugin.run((_CTFd) => {
  const $ = _CTFd.lib.$

  $(document).ready(function() {

    let challenge = $("#challenge-actions").data("challengeIdentifier");

    $(".start-challenge").hide();
    $(".stop-challenge").hide();

    CTFd.fetch("/containers/" + challenge + "/status", {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    })
      .then(r =>  r.json().then(data => ({status: r.status, body: data})))
      .then(obj => {
        console.log(obj.body);
        if (obj.body.started) {
          $(".start-challenge").hide();
          $(".stop-challenge").show();
          document.getElementById("challenge-result").textContent = obj.body.url;
        } else {
          $(".start-challenge").show();
          $(".stop-challenge").hide();
        }
      })
      .catch((error) => console.error(error));


    $(".start-challenge").on("click" , function() {
      let challenge = $("#challenge-actions").data("challengeIdentifier");
    
      CTFd.fetch("/containers/" + challenge + "/start", {
        method: "POST",
        headers: {"Content-Type": "application/json"}
      })
        .then(r =>  r.json().then(data => ({status: r.status, body: data})))
        .then(obj => {
          console.log(obj.body);
          document.getElementById("challenge-result").textContent = obj.body.url;
          $(".stop-challenge").show();
          $(".start-challenge").hide();
        })
        .catch((error) => console.error(error));
    });

    $(".stop-challenge").on("click", function() {
      let challenge = $("#challenge-actions").data("challengeIdentifier");

      CTFd.fetch("/containers/" + challenge + "/stop", {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
      })
        .then(r =>  r.json().then(data => ({status: r.status, body: data})))
        .then(obj => {
          console.log(obj.body);
          document.getElementById("challenge-result").textContent = obj.body.message;
          $(".stop-challenge").hide();
          $(".start-challenge").show();
        })
        .catch((error) => console.error(error));
    });
  });
});