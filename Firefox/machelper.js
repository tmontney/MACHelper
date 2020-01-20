document.addEventListener('paste', onPaste);

function onPaste(event) {
    var paste = (event.clipboardData || window.clipboardData).getData('text');
    var delimExp = new RegExp('^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$');
    var expMatches = delimExp.exec(paste);
    var firstMatch = null;
    if (expMatches == null) {
        var nodelimExp = new RegExp('^([0-9A-Fa-f]{12})$');
        expMatches = nodelimExp.exec(paste);

        if (expMatches !== null) {
            firstMatch = expMatches[0];
        }
    } else {
        firstMatch = expMatches[0];
    }

    if (firstMatch !== null) {
        browser.storage.sync.get({
            sitePreferences: [],
            paste: paste
        }, function (data) {
            var paste = data.paste;

            for (var i = 0; i < data.sitePreferences.length; i++) {
                var result = data.sitePreferences[i];
                if (document.URL.indexOf(result.url) !== -1) {
                    paste = paste.replace(/-/g, "").replace(/:/g, "");
                    if (result.type == "1") {
                        paste = paste.slice(0, 2) + "-" + paste.slice(2, 4) + "-" + paste.slice(4, 6) + "-" + paste.slice(6, 8) + "-" + paste.slice(8, 10) + "-" + paste.slice(10, 12);
                        break;
                    } else if (result.type == "2") {
                        paste = paste.slice(0, 2) + ":" + paste.slice(2, 4) + ":" + paste.slice(4, 6) + ":" + paste.slice(6, 8) + ":" + paste.slice(8, 10) + ":" + paste.slice(10, 12);
                        break;
                    }
                }
            }

            if (document.activeElement.value) {
                document.activeElement.value = document.activeElement.value.replace(data.paste, paste);
            } else {
                document.activeElement.textContent = document.activeElement.textContent.replace(data.paste, paste);
            }
        });
    }
}