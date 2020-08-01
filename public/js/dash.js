$(document).ready(function () {
    init();

    sidenavEventsListeners();
    formsEventListeners();
    modalEventsListeners();
    keyEventListener();
});

const apiAddress = window.location.hostname+":3000";
const value=" €";

function init() {
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown();
    $('.tabs').tabs();
    $('input#productBarcode').characterCounter();
    $('.modal').modal();
}

function sidenavEventsListeners() {
    let tabs = $('.tabs').tabs();


    //Main Sections
    document.getElementById("#pList_btn").addEventListener('click', function () {
        let tbody = document.getElementById('pListTableBody');
        tbody.innerHTML = "";

        tabs.tabs('select', 'pList');

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://" + apiAddress + "/api/productslistcomplete",
            data: {},
            success: (data) => {
                if (data.status) {
                    for (let i = 0; i < data.products.length; i++) {
                        let tr = tbody.insertRow();
                        tr.insertCell().appendChild(document.createTextNode(data.products[i].Name));
                        tr.insertCell().appendChild(document.createTextNode(data.products[i].Price+value));
                        tr.insertCell().appendChild(document.createTextNode(data.products[i].LastUpdate.toString()));
                        tr.insertCell().appendChild(document.createTextNode(data.products[i].Barcode));
                    }
                } else {
                    M.toast({html: 'An error occured!'});
                }
            },
        });



    });
    document.getElementById("#sList_btn").addEventListener('click', function () {
        let tbody = document.getElementById('sListTableBody');
        tbody.innerHTML = "";

        tabs.tabs('select', 'sList');

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://" + apiAddress + "/api/shopslist",
            data: {},
            success: (data) => {
                if (data.status) {
                    for (let i = 0; i < data.shops.length; i++) {
                        let tr = tbody.insertRow();
                        tr.insertCell().appendChild(document.createTextNode(data.shops[i].Name));
                        tr.insertCell().appendChild(document.createTextNode(data.shops[i].Location));
                        tr.insertCell().appendChild(document.createTextNode(data.shops[i].ID));
                    }
                } else {
                    M.toast({html: 'An error occured!'});
                }
            },
        });


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
        let tbody = document.getElementById('modalShopSelectionTableBody');
        tbody.innerHTML = "";

        $('#modalShopSelection').modal('open');

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://" + apiAddress + "/api/shopslist",
            data: {},
            success: (data) => {
                if (data.status) {
                    for (let i = 0; i < data.shops.length; i++) {
                        let tr = tbody.insertRow();
                        tr.insertCell().innerHTML= '<p><label><input type="radio" name="shopSelection" value="' + data.shops[i].ID + '"' + '/><span>&nbsp</span></label></p>';
                        tr.insertCell().appendChild(document.createTextNode(data.shops[i].Name));
                        tr.insertCell().appendChild(document.createTextNode(data.shops[i].Location));
                    }
                } else {
                    M.toast({html: 'An error occured!'});
                }
            },
        });


    });
    document.getElementById('productSel_bnt').addEventListener('click', function () {
        let tbody = document.getElementById('modalProductSelectionTableBody');
        tbody.innerHTML = "";

        $('#modalProdSelection').modal('open');

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://" + apiAddress + "/api/productslist",
            data: {},
            success: (data) => {
                if (data.status) {
                    for (let i = 0; i < data.products.length; i++) {
                        let tr = tbody.insertRow();
                        tr.insertCell().innerHTML = '<p><label><input type="radio" name="productSelection" value="' + data.products[i].Barcode + '"' + '/><span>&nbsp</span></label></p>';
                        tr.insertCell().appendChild(document.createTextNode(data.products[i].Barcode));
                        tr.insertCell().appendChild(document.createTextNode(data.products[i].Name));
                    }
                } else {
                    M.toast({html: 'An error occured!'});
                }
            },
        });

    });

    //buttons
    document.getElementById('addProd_btn').addEventListener('click', function () {
        let productBarcode = document.getElementById('productBarcode');
        let productName = document.getElementById('productName');
        let productBrand = document.getElementById('productBrand');
        let isOK = true;

        if (productBarcode.value === "") {
            productBarcode.classList.add('invalid');
            isOK = false;
        } else {
            productBarcode.classList.remove('invalid');
        }
        if (productName.value === "") {
            productName.classList.add('invalid');
            isOK = false;
        } else {
            productName.classList.remove('invalid');
        }
        if (productBrand.value === "") {
            productBrand.classList.add('invalid');
            isOK = false;
        } else {
            productBrand.classList.remove('invalid');
        }

        if (isOK) {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "http://" + apiAddress + "/api/newproduct",
                data: {
                    'productBarcode': productBarcode.value.trim(),
                    'productName': productName.value.trim(),
                    'productBrand': productBrand.value.trim(),
                },
                success: (data) => {
                    if (data.status) {
                        M.toast({html: 'Product succesfully added!'});
                        document.getElementById('newProductForm').reset();
                    } else {
                        M.toast({html: 'An error occured!\nplease try again'});
                    }
                },
            });
        }

    });


    document.getElementById('addShop_btn').addEventListener('click', function () {
        let shopName = document.getElementById('shopName');
        let shopStreetName = document.getElementById('shopStreetName');
        let shopStreetNumber = document.getElementById('shopStreetNumber');
        let shopZIP = document.getElementById('shopZIP');
        let shopCity = document.getElementById('shopCity');
        let isOK = true;

        if (shopName.value === "") {
            shopName.classList.add('invalid');
            isOK = false;
        } else {
            shopName.classList.remove('invalid');
        }
        if (shopStreetName.value === "") {
            shopStreetName.classList.add('invalid');
            isOK = false;
        } else {
            shopStreetName.classList.remove('invalid');
        }
        if (shopStreetNumber.value === "") {
            shopStreetNumber.classList.add('invalid');
            isOK = false;
        } else {
            shopStreetNumber.classList.remove('invalid');
        }
        if (shopZIP.value === "") {
            shopZIP.classList.add('invalid');
            isOK = false;
        } else {
            shopZIP.classList.remove('invalid');
        }
        if (shopCity.value === "") {
            shopCity.classList.add('invalid');
            isOK = false;
        } else {
            shopCity.classList.remove('invalid');
        }

        if (isOK) {
            //console.log('Everything OK');
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "http://" + apiAddress + "/api/newshop",
                data: {
                    'shopName': shopName.value.trim(),
                    'shopStreetName': shopStreetName.value.trim(),
                    'shopStreetNumber': shopStreetNumber.value.trim(),
                    'shopZIP': shopZIP.value.trim(),
                    'shopCity': shopCity.value.trim()
                },
                success: (data) => {
                    if (data.status) {
                        M.toast({html: 'Shop successfully added!'});
                        document.getElementById('newShopForm').reset();
                    } else {
                        M.toast({html: 'An error occured!\nplease try again'});
                    }
                }
            });
        }

    });

    document.getElementById('rSale_btn').addEventListener('click', function () {
        let shop = document.getElementById('shopSel');
        let product = document.getElementById('productSel');
        let price = document.getElementById('prodPrice');
        let quantity = document.getElementById('prodQuantity');
        let pricePerUnit = document.getElementById('prodPricePerUnit');
        let onSale= document.getElementById('isOnSale');
        let isOK = true;

        if (shop.value === "") {
            shop.classList.add('invalid');
            isOK = false;
        } else {
            shop.classList.remove('invalid');
        }
        if (product.value === "") {
            product.classList.add('invalid');
            isOK = false;
        } else {
            product.classList.remove('invalid');
        }
        if (price.value === "") {
            price.classList.add('invalid');
            isOK = false;
        } else {
            price.classList.remove('invalid');
        }
        if (quantity.value === "") {
            quantity.classList.add('invalid');
            isOK = false;
        } else {
            quantity.classList.remove('invalid');
        }
        if (pricePerUnit.value === "") {
            pricePerUnit.classList.add('invalid');
            isOK = false;
        } else {
            pricePerUnit.classList.remove('invalid');
        }

        if (isOK) {
            //console.log('Everything OK');
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "http://" + apiAddress + "/api/registersale",
                data: {
                    'shopID': shop.value.trim(),
                    'productBarcode': product.value.trim(),
                    'price': price.value,
                    'quantity': quantity.value,
                    'pricePerUnit': pricePerUnit.value,
                    'isOnSale': (onSale.value === 'on')? 1 : 0
                },
                success: (data) => {
                    if (data.status) {
                        M.toast({html: 'Sale successfully added!'});
                        document.getElementById('rSaleForm').reset();
                    } else {
                        M.toast({html: 'An error occured!\nplease try again'});
                    }
                }
            });
        }
    });

}

function modalEventsListeners() {
    document.getElementById('modalProdSelectionYes').addEventListener('click', function () {
        document.getElementById('productSel').value = document.querySelector('input[name = "productSelection"]:checked').value;
        document.getElementById('productSelLabel').classList.add('active');
        $('#modalProdSelection').modal('close');
    });
    document.getElementById('modalShopSelectionYes').addEventListener('click', function () {
        document.getElementById('shopSel').value = document.querySelector('input[name = "shopSelection"]:checked').value;
        document.getElementById('shopSelLabel').classList.add('active');
        $('#modalShopSelection').modal('close');
    });
    document.getElementById('modalLogoutYes').addEventListener('click', function () {
        $.ajax({
            type: "POST",
            url: "/dash/logout",
            dataType: "json",
            success: (data) => {
                if (data.success) {
                    window.location.href = "/";
                } else {
                    alert("Error while logging out\nPlease try again");
                    $('#modalLogout').modal('close');
                }
            }
        });
    });
    document.getElementById('modalUpdateYes').addEventListener('click', function () {

    });
}

function keyEventListener() {
    document.addEventListener('keypress', function (event) {
        if (event.key === "Enter") {
            if (document.getElementById('modalLogout').isOpen) {
                document.getElementById('modalLogoutYes').click();
            } else if (document.getElementById('modalProdSelection').isOpen) {
                document.getElementById('modalProdSelectionYes').click();
            } else if (document.getElementById('modalShopSelection').isOpen) {
                document.getElementById('modalShopSelectionYes').click();
            } else if (document.getElementById('nProduct').classList.contains('active')) {
                document.getElementById('#nProduct_btn').click();
            } else if (document.getElementById('nShop').classList.contains('active')) {
                document.getElementById('#nShop_btn').click();
            } else if (document.getElementById('rSale').classList.contains('active')) {
                document.getElementById('rSale_btn').click();
            }
        }
    });
}