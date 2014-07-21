$(function() {
    $('a.subcategory').on('mouseover', function() {
        $('+ ul', this).show();
    });
});