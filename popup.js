$(document).ready(function() {

    function displayVersion() {
        var oManifest = chrome.runtime.getManifest();
        var sText = "Version: " + oManifest.version;

        $('#cur_vers').text(sText);
    }

    displayVersion();

    $('body').on('click', 'a', function() {
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });
});