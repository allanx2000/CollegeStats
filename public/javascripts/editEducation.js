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
    $("#school").liveSearch({
        url: '/ajax/findSchool?school=',
        onData: function (data) {
            return makeList(JSON.parse(data), "No schools found.")
        }
    });

    $("html").click(function () {
        $("#live-search-school").html("")
    })

    $("#major1").liveSearch({
        url: '/ajax/findSchool?school=',
        onData: function (data) {
            return makeList(JSON.parse(data), "No schools found.")
        }
    });

})

function makeList(data, noneText) {

    if (data === null || data.length === 0)
        return "<p>" + noneText + "</p>";

    var table = "<table class='table table-hover'>";
    for (var i = 0; i < data.length; i++) {
        var d = data[i];

        table += "<tr onclick='setSchool(this)'><td>" + d.name + "</td></tr>";
    }

    table += "</table>";

    return table;
}

function setSchool(element) {
    $("#school").val($(element).text())
    $("#live-search-school").html("")
    $("#live-search-school").liveSearchLastValue = "";
}