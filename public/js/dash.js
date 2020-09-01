$(document).ready(function () {
    init();
    sidenavEventsListeners();
    formsEventListeners();
    modalEventsListeners();
    keyEventListener();
});

const apiProtocol = 'http';
const apiPort = '3000';
const apiAddress = 'localhost';
const apiURL = apiProtocol + "://" + apiAddress + ":" + apiPort;
const value = " €";

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
        console.log(apiURL);

        $.ajax({
            type: "GET",
            dataType: "json",
            url: apiURL + "/api/productslistcomplete",
            data: {},
            success: (data) => {
                if (data.status) {
                    for (let i = 0; i < data.products.length; i++) {
                        let tr = tbody.insertRow();
                        tr.insertCell().appendChild(document.createTextNode(data.products[i].Name));
                        if (data.products[i].Price !== ' ') {
                            tr.insertCell().appendChild(document.createTextNode(data.products[i].Price + value + " (" + data.products[i].shop + ")"));
                            tr.insertCell().appendChild(document.createTextNode(data.products[i].LastUpdate.toString()));
                            tr.insertCell().innerHTML = '<a href="#" onclick="prodDetails(' + data.products[i].Barcode + ')"><i class="material-icons">read_more</i></a><a href="#" onclick="editProd(' + data.products[i].Barcode + ')"><i class="material-icons">edit</i></a><a href="#" onclick="prodDelete(' + data.products[i].Barcode + ')"><i class="material-icons">delete</i></a>';
                        } else {
                            tr.insertCell().appendChild(document.createTextNode(" "));
                            tr.insertCell().appendChild(document.createTextNode(" "));
                            tr.insertCell().innerHTML = '<a href="#" onclick="editProd(' + data.products[i].Barcode + ')"><i class="material-icons">edit</i></a><a href="#" onclick="prodDelete(' + data.products[i].Barcode + ')"><i class="material-icons">delete</i></a>';
                        }
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
            url: apiURL + "/api/shopslist",
            data: {},
            success: (data) => {
                if (data.status) {
                    for (let i = 0; i < data.shops.length; i++) {
                        let tr = tbody.insertRow();
                        tr.insertCell().appendChild(document.createTextNode(data.shops[i].Name));
                        tr.insertCell().appendChild(document.createTextNode(data.shops[i].Location));
                        tr.insertCell().innerHTML = '<a href="#" onclick="shopDetails(' + data.shops[i].ID + ')"><i class="material-icons">read_more</i></a><a href="#" onclick="editShop(' + data.shops[i].ID + ')"><i class="material-icons">edit</i></a><a href="#" onclick="shopDelete(' + data.shops[i].ID + ')"><i class="material-icons">delete</i></a>';
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
            url: apiURL + "/api/shopslist",
            data: {},
            success: (data) => {
                if (data.status) {
                    for (let i = 0; i < data.shops.length; i++) {
                        let tr = tbody.insertRow();
                        tr.insertCell().innerHTML = '<p><label><input type="radio" name="shopSelection" value="' + data.shops[i].ID + '"' + '/><span>&nbsp</span></label></p>';
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
            url: apiURL + "/api/productslist",
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
                url: apiURL + "/api/newproduct",
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
            $.ajax({
                type: "GET",
                dataType: "json",
                url: apiURL + "/api/newshop",
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
            $.ajax({
                type: "GET",
                dataType: "json",
                url: apiURL + "/api/registersale",
                data: {
                    'shopID': shop.value.trim(),
                    'productBarcode': product.value.trim(),
                    'price': price.value,
                    'quantity': quantity.value,
                    'pricePerUnit': pricePerUnit.value,
                    'isOnSale': ($('#isOnSale').is(':checked')) ? 1 : 0
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
            url: apiURL + "/api/logout",
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
    document.getElementById('modalEditProductConfirm').addEventListener('click', function () {
        let productName = document.getElementById('modalEditProductName');
        let productBrand = document.getElementById('modalEditProductBrand');
        let isOK = true;

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
                url: apiURL + "/api/editproduct",
                data: {
                    'productBarcode': document.getElementById('modalEditProductBarcode').value.toString().trim(),
                    'productName': productName.value.trim(),
                    'productBrand': productBrand.value.trim(),
                },
                success: (data) => {
                    if (data.status) {
                        $('#modalEditProduct').modal('close');
                        M.toast({html: 'Product successfully Edited!'});
                        document.getElementById('#pList_btn').click();
                    } else {
                        M.toast({html: 'An error occurred!\nplease try again'});
                    }
                },
            });
        }

    });
    document.getElementById('modalEditShopConfirm').addEventListener('click', function () {
        let shopName = document.getElementById('modalEditShopName');
        let shopStreetName = document.getElementById('modalEditShopStreetName');
        let shopStreetNumber = document.getElementById('modalEditShopStreetNumber');
        let shopZIP = document.getElementById('modalEditShopZIP');
        let shopCity = document.getElementById('modalEditShopCity');
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
            $.ajax({
                type: "GET",
                dataType: "json",
                url: apiURL + "/api/editshop",
                data: {
                    'shopID': document.getElementById('modalEditShopID').value.toString().trim(),
                    'shopName': shopName.value.trim(),
                    'shopStreetName': shopStreetName.value.trim(),
                    'shopStreetNumber': shopStreetNumber.value.trim(),
                    'shopZIP': shopZIP.value.trim(),
                    'shopCity': shopCity.value.trim()
                },
                success: (data) => {
                    if (data.status) {
                        $('#modalEditShop').modal('close');
                        M.toast({html: 'Shop successfully Edited!'});
                        document.getElementById('#sList_btn').click();
                    } else {
                        M.toast({html: 'An error occured!\nplease try again'});
                    }
                }
            });
        }

    });
    document.getElementById('modalDeleteConfirm').addEventListener('click', function () {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: apiURL + "/api/datadelete",
            data: {
                'type': document.getElementById('modalDeleteType').value.toString().trim(),
                'identifier': document.getElementById('modalDeleteIdentifier').value.toString().trim()
            },
            success: (data) => {
                if (data.status) {
                    $('#modalDelete').modal('close');
                    M.toast({html: 'Data successfully Deleted!'});
                    switch (data.type) {
                        case 1:
                            document.getElementById('#sList_btn').click();
                            break;
                        case 2:
                            document.getElementById('#pList_btn').click();
                            break;
                        default:
                            break;
                    }
                } else {
                    M.toast({html: 'An error occured!\nplease try again'});
                }
            }
        });
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

function prodDetails(barcode) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: apiURL + "/api/productdetails",
        data: {
            'Barcode': barcode.toString().trim()
        },
        success: (data) => {
            if (data.status) {
                document.getElementById('modalProdDetailsTitle').innerText = data.Name + " Details";
                let detailsTable = document.getElementById('modalProdDetailsTableBody');
                let shopsTable = document.getElementById('modalProdDetailsShopListTableBody');

                detailsTable.innerHTML = "";
                shopsTable.innerHTML = "";

                let tr = detailsTable.insertRow();
                tr.insertCell().appendChild(document.createTextNode('Barcode:'));
                tr.insertCell().appendChild(document.createTextNode(data.Barcode));
                tr = detailsTable.insertRow();
                tr.insertCell().appendChild(document.createTextNode('Name:'));
                tr.insertCell().appendChild(document.createTextNode(data.Name));
                tr = detailsTable.insertRow();
                tr.insertCell().appendChild(document.createTextNode('Brand:'));
                tr.insertCell().appendChild(document.createTextNode(data.Brand));

                tr = detailsTable.insertRow();
                tr.insertCell().appendChild(document.createTextNode('Best Price:'));
                tr.insertCell().appendChild(document.createTextNode(data.BestPrice + value));

                tr = detailsTable.insertRow();
                tr.insertCell().appendChild(document.createTextNode('LastUpdate:'));
                tr.insertCell().appendChild(document.createTextNode(data.LastUpdate));

                for (let i = 0; i < data.shops.length; i++) {
                    let tr = shopsTable.insertRow();
                    tr.insertCell().appendChild(document.createTextNode(data.shops[i].Name));
                    tr.insertCell().appendChild(document.createTextNode(data.shops[i].Location));
                    tr.insertCell().appendChild(document.createTextNode(data.shops[i].Price + value));
                    tr.insertCell().appendChild(document.createTextNode(data.shops[i].LastUpdate));
                }

                $('#modalProdDetails').modal('open');
            } else {
                M.toast({html: 'An error occured!<br/>please try again'});
            }
        }
    });
}

function shopDetails(ID) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: apiURL + "/api/shopdetails",
        data: {
            'ID': ID.toString().trim()
        },
        success: (data) => {
            if (data.status) {
                document.getElementById('modalShopDetailsTitle').innerText = data.Name + "Details";

                let detailsTable = document.getElementById('modalShopDetailsTableBody');
                let productsTable = document.getElementById('modalShopDetailsProdListTableBody');

                detailsTable.innerHTML = "";
                productsTable.innerHTML = "";

                let tr = detailsTable.insertRow();
                tr.insertCell().appendChild(document.createTextNode('ID:'));
                tr.insertCell().appendChild(document.createTextNode(data.ID));
                tr = detailsTable.insertRow();
                tr.insertCell().appendChild(document.createTextNode('Name:'));
                tr.insertCell().appendChild(document.createTextNode(data.Name));
                tr = detailsTable.insertRow();
                tr.insertCell().appendChild(document.createTextNode('Location:'));
                tr.insertCell().appendChild(document.createTextNode(data.Location));


                for (let i = 0; i < data.products.length; i++) {
                    let tr = productsTable.insertRow();
                    tr.insertCell().appendChild(document.createTextNode(data.products[i].Barcode));
                    tr.insertCell().appendChild(document.createTextNode(data.products[i].Name));
                    tr.insertCell().appendChild(document.createTextNode(data.products[i].Price + value));
                    tr.insertCell().appendChild(document.createTextNode(data.products[i].LastUpdate));
                }


                $('#modalShopDetails').modal('open');
            } else {
                M.toast({html: 'An error occured!<br/>please reload and try again'});
            }
        }
    });
}

function editShop(ID) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: apiURL + "/api/shopdetailsedit",
        data: {
            'ID': ID.toString().trim()
        },
        success: (data) => {
            if (data.status) {
                document.getElementById('modalEditShopTitle').innerText = "Edit " + data.Name;
                document.getElementById('modalEditShopID').value = data.ID;
                document.getElementById('modalEditShopName').value = data.Name;
                document.getElementById('modalEditShopNameLabel').classList.add('active');
                document.getElementById('modalEditShopStreetName').value = data.StreetName;
                document.getElementById('modalEditShopStreetNameLabel').classList.add('active');
                document.getElementById('modalEditShopStreetNumber').value = data.StreetNumber;
                document.getElementById('modalEditShopStreetNumberLabel').classList.add('active');
                document.getElementById('modalEditShopCity').value = data.City;
                document.getElementById('modalEditShopCityLabel').classList.add('active');
                document.getElementById('modalEditShopZIP').value = data.ZIPCode
                document.getElementById('modalEditShopZIPLabel').classList.add('active');
                $('#modalEditShop').modal('open');
            } else {
                M.toast({html: 'An error occured!<br/>please reload and try again'});
            }
        }
    });
}

function shopDelete(ID) {
    document.getElementById('modalDeleteTitle').innerText = "Do you really want to delete this Shop?"
    document.getElementById('modalDeleteType').value = 1;
    document.getElementById('modalDeleteIdentifier').value = ID.toString().trim();
    $('#modalDelete').modal('open');
}

function editProd(Barcode) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: apiURL + "/api/productdetailsedit",
        data: {
            'Barcode': Barcode.toString().trim()
        },
        success: (data) => {
            if (data.status) {
                document.getElementById('modalEditProductTitle').innerText = "Edit " + data.Name;
                document.getElementById('modalEditProductBarcode').value = data.Barcode;
                document.getElementById('modalEditProductName').value = data.Name;
                document.getElementById('modalEditProductNameLabel').classList.add('active');
                document.getElementById('modalEditProductBrand').value = data.Brand;
                document.getElementById('modalEditProductBrandLabel').classList.add('active');
                $('#modalEditProduct').modal('open');
            } else {
                M.toast({html: 'An error occured!<br/>please reload and try again'});
            }
        }
    });
}

function prodDelete(Barcode) {
    document.getElementById('modalDeleteTitle').innerText = "Do you really want to delete this Product?"
    document.getElementById('modalDeleteType').value = 2;
    document.getElementById('modalDeleteIdentifier').value = Barcode.toString().trim();
    $('#modalDelete').modal('open');
}