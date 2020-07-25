$(document).ready(function () {
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown();
    var tabs = $('.tabs').tabs();

    document.getElementById("#pList_btn").addEventListener('click', function () {
        tabs.tabs('select', 'pList');
    });
    document.getElementById("#sList_btn").addEventListener('click', function () {
        tabs.tabs('select', 'sList');
    });
    document.getElementById("#nProduct_btn").addEventListener('click', function () {
        tabs.tabs('select', 'nProduct');
    });
    document.getElementById("#nShop_btn").addEventListener('click', function () {
        tabs.tabs('select', 'nShop');
    });
});