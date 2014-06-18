$(function() {
  showDetailsForm = function() {
    $('#screenshareForm').hide();
    $('#appDetails').show();

    chrome.storage.sync.get(["appid", "baseUrl"], function(data) {
      console.log(data);
      $('#appID').val(data['appid']);
      $('#appURL').val(data['baseUrl']);
    });
  }

  showCallForm = function() {
    $('#appDetails').hide();
    $('#screenshareForm').show();
  }

  chrome.storage.sync.get(["appid", "baseUrl"], function(data) {
    if (data['appid'] === undefined || data['baseUrl'] === undefined) {
      showDetailsForm();
    }
  });

  setDetails = function(appid, url) {
    chrome.storage.sync.set({"appid" : appid, "baseUrl" : url}, function(data) {
      console.log(data);
      showCallForm();
    });
  }


  $('#editDetails').on('click', function(e) {
    e.preventDefault();
    showDetailsForm();
  });

  $("#appDetails").submit(function(e) {
    e.preventDefault();

    setDetails($('#appID').val(), $('#appURL').val());
  });

   
  $("#screenshareForm").submit(function(e) {
    e.preventDefault();

    chrome.storage.sync.get(["appid", "baseUrl"], function(data) {
      console.log(data);

      var client = new respoke.Client({
        appId: data['appid'],
        developmentMode: false,
        baseURL: data['baseUrl']
      });

      var endpoint = client.getEndpoint({"id" : $("input[name='remoteID']").val()});

      endpoint.startCall({
        constraints: {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'screen',
              maxWidth: 1280,
              maxHeight: 720,
            },
            optional: []
          }
        }
      });
    });

  });
  
});
