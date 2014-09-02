$(function() {
    var archive = $('a.subcategory');
    archive.on('mouseover', function() {
        $('+ ul', this).show();
    });

    // Hide the expanded dropdown when the mouse leaves the about us
    archive.parent().parent().on('mouseleave', function() {
        $('+ ul', archive).hide();
    });
});