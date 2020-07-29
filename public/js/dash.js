$(document).ready(function () {
    init();

    sidenavEventsListeners();
    formsEventListeners();
    modalEventsListeners();
});

function init() {
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown();
    $('.tabs').tabs();
    $('input#barcode').characterCounter();
    $('.modal').modal();
}

function sidenavEventsListeners() {
    var tabs = $('.tabs').tabs();


    //Main Sections
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
    document.getElementById("#nSale_btn").addEventListener('click', function () {
        tabs.tabs('select', 'rSale');
    });

    //User Dropdown
    document.getElementById("#api_btn").addEventListener('click', function () {
        $('#modalApiKeys').modal('open');
    });
    document.getElementById("#logout_btn").addEventListener('click', function () {
        $('#modalLogout').modal('open');
    });
}

function formsEventListeners() {

    //modals
    document.getElementById('shopSel_btn').addEventListener('click', function () {
        $('#modalShopSelection').modal('open');
    });
    document.getElementById('productSel_bnt').addEventListener('click', function () {
        $('#modalProdSelection').modal('open');
    });

    //buttons
    document.getElementById('addProd_btn').addEventListener('click', function () {

    });
    document.getElementById('addShop_btn').addEventListener('click', function () {

    });
    document.getElementById('rSale_btn').addEventListener('click', function () {

    });

}

function modalEventsListeners() {
    document.getElementById('modalProdSelectionYes').addEventListener('click', function () {

    });
    document.getElementById('modalShopSelectionYes').addEventListener('click', function () {

    });
    document.getElementById('modalLogoutYes').addEventListener('click', function () {
        $.ajax({
            type: "POST",
            url: "/dash/logout",
            dataType: "json",
            success: (data, textStatus) => {
                if (data.success) {
                    window.location.href = "/";
                } else {
                    alert("An error occured while logging out\nPlease try again");
                    $('#modalLogout').modal('close');
                }
            }
        });
    });
    document.getElementById('modalUpdateYes').addEventListener('click', function () {

    });
}