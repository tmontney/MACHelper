function addSitePreference(url, type, addToStorage) {
  var urlDropdown = document.getElementById("urls");

  var option = document.createElement("option");
  option.text = url;
  option.value = type;

  urlDropdown.appendChild(option);

  if (urlDropdown.length > 0) {
    urlDropdown.selectedIndex = 0;
  }

  if (addToStorage) {
    browser.storage.sync.get({
      sitePreferences: []
    }, function (data) {
      var pref = {};
      pref["url"] = url;
      pref["type"] = type;
      data.sitePreferences.push(pref);

      browser.storage.sync.set({
        sitePreferences: data.sitePreferences
      });
    });
  }
}

function removeSitePreference(url) {
  browser.storage.sync.get({
    sitePreferences: []
  }, function (data) {
    for (var i = 0; i < data.sitePreferences.length; i++) {
      if (data.sitePreferences[i]["url"] == url) {
        data.sitePreferences.splice(i);
        break;
      }
    }

    browser.storage.sync.set({
      sitePreferences: data.sitePreferences
    });
  });
}

function restoreOptions() {
  browser.storage.sync.get({
    sitePreferences: []
  }, function (data) {
    var sitePrefs = data.sitePreferences;
    var urlDropdown = document.getElementById("urls");
    for (var i = 0; i < urlDropdown.options.length; i++) {
      urlDropdown.options[i].remove();
    }
    for (var i = 0; i < sitePrefs.length; i++) {
      addSitePreference(sitePrefs[i]["url"], sitePrefs[i]["type"], false);
    }

    if(sitePrefs.length > 0){
      urlDropdown.selectedIndex = 0;
      document.getElementById("urlMacType").selectedIndex = urlDropdown.options[0].value;
    }
  });
}

function addUrl() {
  var url = document.getElementById("addUrlTXT");
  var type = document.getElementById("urlMacType");
  if (url.value !== "" && type.selectedIndex !== -1) {
    addSitePreference(url.value, type.value, true);
  }else if(url.value == ""){
    alert("URL cannot be empty!");
  }else{
    alert("Please select MAC type delimiter");
  }
}

function removeUrl() {
  var urls = document.getElementById("urls");
  var selectedUrl = null;
  if (urls.selectedIndex !== -1) {
    selectedUrl = urls.options[urls.selectedIndex].text;
    urls.options[urls.selectedIndex].remove();

    removeSitePreference(selectedUrl);
  }
}

function selectUrl() {
  var urls = document.getElementById("urls");
  if (urls.selectedIndex !== -1) {
    var types = document.getElementById("urlMacType");
    var type = urls[urls.selectedIndex].value;
    types.selectedIndex = parseInt(type);
  }
}


document.addEventListener("DOMContentLoaded", restoreOptions);

document.getElementById("urls").addEventListener("change", selectUrl);
document.getElementById("addUrl").addEventListener("click", addUrl);
document.getElementById("removeUrl").addEventListener("click", removeUrl);