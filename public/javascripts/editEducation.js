/*$(document).ready(function () {
 $("#school").autocomplete(
 {
 source: function(req , res) {

 $.ajax(
 {
 type: "GET",
 url: "/ajax/findSchool?school=" + $('#school').val(),
 dataType: "json",
 success: function (data) {
 var results;

 if (data == null)
 results = [{label: "No schools found", value: ""}];
 else {
 results = $.map(data, function (item) {
 return {
 label: item.name,
 value: item.name
 }
 });
 }

 res(results);
 }
 });
 }
 });
 })*/

$(document).ready(function () {
    $("html").click(function () {
        clearAll();

    })

    $("#school").liveSearch({
        url: '/ajax/findSchool?school=',
        onData: function (data) {
            return makeList(JSON.parse(data), "setSchool", "No schools found.")
        }
    });

    $("#major1").liveSearch({
        url: '/ajax/findDegree?degree=',
        onData: function (data) {
            return makeList(JSON.parse(data), "setMajor1", "No schools found.")
        }
    });

})

function clearAll() {
    $("#live-search-school").html("");
    $("#live-search-school").liveSearchLastValue = "";

    $("#live-search-major1").html("");
    $("#live-search-major1").liveSearchLastValue = "";

    //$("#live-search-major2").html("");
    //$("#live-search-major1").liveSearchLastValue = "";

    //$("#live-search-minor").html("");
    //$("#live-search-minor").liveSearchLastValue = "";
}

function makeList(data, functionToClick, noneText) {

    if (data === null || data.length === 0)
        return "<p>" + noneText + "</p>";

    var table = "<table class='table table-hover'>";
    for (var i = 0; i < data.length; i++) {
        var d = data[i];

        table += "<tr onclick='" + functionToClick + "(this)'><td>" + d.name + "</td></tr>";
    }

    table += "</table>";

    return table;
}

function setSchool(element) {
    $("#school").val($(element).text())

    clearAll();
}

function setMajor1(element) {
    $("#major1").val($(element).text())

    clearAll();
}