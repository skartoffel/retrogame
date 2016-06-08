$(function () {

    var RETROGame = {
        init: function () {

            var sPage = this._getPage();
            var sMode = this._getMode();

            this.doAction(sPage, sMode);

        },
        doAction: function (sPage, sMode) {

            if (sPage === 'overview') {
                this.showEventTimes();
            }

            if (sPage === 'flotten1') {
                this.showRecallTimes();
            }

            if (sPage === 'flotten2') {
                this.showFleetTimes();
            }
        },
        showEventTimes: function () {
            var that = this;
            var aCountdowns = $('div[id^="bxx"]');

            aCountdowns.each(function(idx) {
                var sDuration = $(this).attr('title');
                var iDurationInMS = +sDuration * 1000;
                var dEvent = new Date(Date.now() + iDurationInMS);
                var sEvent = that._formatDate(dEvent);
                $(this).parent().append('<div class="rg-stamp">' + sEvent + '</div>');
            })
        },
        showRecallTimes: function () {
            var that = this;
            var aButtons = $('input[value="recall"]');

            var updateButtons = function () {
                aButtons.each(function (idx) {
                    var oTR = $(this).closest('tr');
                    var oTHDeparture = oTR.children('th:nth-child(5)');
                    var sDepartureTime = oTHDeparture.text();

                    if (sDepartureTime.match(/^\w{3}\s\w{3}\s\d{1,2}\s\d{1,2}:\d{2}:\d{2}$/)) {
                        // assuming that this means it takes place in the current year
                        var dNow = new Date();
                        var dDeparture = $.format.parseDate(sDepartureTime + ' CET ' + dNow.getFullYear());
                        var dReturn = new Date(dNow.getTime() * 2 - dDeparture.date);
                        var sReturn = that._formatDate(dReturn);
                        $(this).val('recall (' + sReturn + ')')
                    }
                });

                setTimeout(updateButtons, 500);
            };

            updateButtons();
        },
        showFleetTimes: function () {
            var oTarget = $('#duration');
            var that = this;

            $('#content > center > center').append('<table style="width: 519px;">'
                + '<tbody>'
                + '<tr><th>Arrives at</th><th id="rg-arrival">-</th></tr>'
                + '<tr><th> Returns at </th><th id="rg-return">-</th></tr>'
                + '</tbody></table>'
            );

            this._calcFleetTimes(oTarget);

            var oObserver = new MutationObserver(function (mutations) {
                that._calcFleetTimes(oTarget);
            });

            oObserver.observe(oTarget[0], {
                characterData: true,
                subtree: true
            });
        },
        _calcRecallTimes() {

        },
        _formatDate(dDate) {
            var dNow = new Date();
            var sFormat = 'H:mm:ss';
            if (dDate.getFullYear() !== dNow.getFullYear()) {
                sFormat = 'E d yyy ' + sFormat;
            } else if (dDate.getDate() !== dNow.getDate()) {
                sFormat = 'E d ' + sFormat;
            }

            return $.format.date(dDate, sFormat);
        },
        _calcFleetTimes: function (oTarget) {

            var that = this;

            if (that.timeout) {
                clearTimeout(that.timeout);
                delete that.timeout;
            }

            var sDuration = oTarget.text();
            var aMatch = sDuration.match(/^(\d+):(\d{2}):(\d{2}) h$/);
            var iHours, iMinutes, iSeconds, iHoursInMS, iMinutesInMS, iSecondsInMS, iDurationInMS;

            var updateTable = function (iDuration) {
                var dArrivalDate = new Date(Date.now() + iDurationInMS);
                var dReturnDate = new Date(Date.now() + iDurationInMS * 2);

                $('#rg-arrival').text(dArrivalDate.toString());
                $('#rg-return').text(dReturnDate.toString());

                that.timeout = setTimeout(updateTable, 1000, iDuration);
            }

            if (aMatch && aMatch.length === 4) {
                iHours = +aMatch[1];
                iMinutes = +aMatch[2];
                iSeconds = +aMatch[3];

                iHoursInMS = iHours * 60 * 60 * 1000;
                iMinutesInMS = iMinutes * 60 * 1000;
                iSecondsInMS = iSeconds * 1000;

                iDurationInMS = iHoursInMS + iMinutesInMS + iSecondsInMS

                updateTable(iDurationInMS);
            }
        },
        _getPage: function () {
            var aMatch = location.search.match(/page=([a-zA-Z0-9]+)/);

            if (aMatch && aMatch.length === 2) {
                return aMatch[1];
            }

            return "";
        },
        _getMode: function () {
            var aMatch = location.search.match(/page=([a-zA-Z0-9]+)/);

            if (aMatch && aMatch.length === 2) {
                return aMatch[1];
            }

            return "";
        }
    };

    RETROGame.init();
});