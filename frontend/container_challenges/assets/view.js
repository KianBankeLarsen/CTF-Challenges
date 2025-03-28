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
    const challenge = parseInt(CTFd.lib.$("#challenge-id").val());
    $(".start-challenge").hide();
    $(".stop-challenge").hide();

    CTFd.fetch("/containers/" + challenge + "/status", {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    })
      .then(response => response.json().then(data => ({status: response.status, body: data})))
      .then(obj => {
        if (obj.body.started) {
          $(".start-challenge").hide();
          $(".stop-challenge").show();
          document.getElementById("challenge-result").textContent = obj.body.url;
        } else {
          $(".start-challenge").show();
          $(".stop-challenge").hide();
          document.getElementById("challenge-result").textContent = "";
        }
        const badge = $("#verified-badge");
        if (obj.body.verified) {
            badge.text("Verified").removeClass("badge-unverified").addClass("badge-verified").show();
        } else {
            badge.text("Unverified").removeClass("badge-verified").addClass("badge-unverified").show();
        }
      })
      .catch(error => { 
        console.error(error);
        document.getElementById("challenge-result").textContent = "Request failed, try to reload";
      });

    $(".start-challenge").on("click" , function() {
      const challenge = parseInt(CTFd.lib.$("#challenge-id").val());
      $(".start-challenge").prop("disabled", true);
      CTFd.fetch("/containers/" + challenge + "/start", {
        method: "POST",
        headers: {"Content-Type": "application/json"}
      })
        .then(response => response.json().then(data => ({status: response.status, body: data})))
        .then(obj => {
          if (obj.status === 200) {
            document.getElementById("challenge-result").textContent = obj.body.url;
            $(".stop-challenge").show();
            $(".start-challenge").hide();
          } else {
            document.getElementById("challenge-result").textContent = obj.body.message;
          }
          $(".start-challenge").removeAttr("disabled");
        })
        .catch(error => { 
          console.error(error);
          $(".start-challenge").removeAttr("disabled");
          document.getElementById("challenge-result").textContent = "Request failed, try to reload";
        });
    });

    $(".stop-challenge").on("click", function() {
      const challenge = parseInt(CTFd.lib.$("#challenge-id").val());
      $(".stop-challenge").prop("disabled", true);

      CTFd.fetch("/containers/" + challenge + "/stop", {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
      })
        .then(response => response.json().then(data => ({status: response.status, body: data})))
        .then(obj => {
          if (obj.status === 200) {
            document.getElementById("challenge-result").textContent = "";
            $(".stop-challenge").hide();
            $(".start-challenge").show();
          } else {
            document.getElementById("challenge-result").textContent = obj.body.message;
          }
          $(".stop-challenge").removeAttr("disabled");
        })
        .catch(error => { 
          console.error(error);
          $(".stop-challenge").removeAttr("disabled");
          document.getElementById("challenge-result").textContent = "Request failed, try to reload";
        });
    });
  });
});
