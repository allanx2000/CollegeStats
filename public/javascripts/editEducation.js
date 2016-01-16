$(document).ready(function () {
    $("#school").liveSearch({url: '/ajax/findSchool?school='});
})

function setSchool(value) {
    $("#school").val(value)
    $("")
}