//document.addEventListener('deviceready', onDeviceReady, false);
$(document).ready(function () {

    onDeviceReady();

});

function init_localstorage() {
    var hostname = glob_hostname;
    var hostname_foto = glob_hostname_foto;
    var hostname_other = glob_hostname_other;


    localStorage.setItem('hostname', hostname);
    localStorage.setItem('hostname_foto', hostname_foto);
    localStorage.setItem('hostname_other', hostname_other);


//    localStorage.setItem('mac_address_printer', null);

}

function get_usaha() {
    var url = localStorage.getItem('hostname') + 'usaha/';
    var token = localStorage.getItem('token');

    $.ajax({
        url: url,
        type: 'post',
        crossDomain: true,
        data: {
            'token': token,
        }, success: function (result) {

        }, error: function (err) {
            if (confirm("Koneksi Gagal Coba lagi ?")) {
                txt = "Ya";
                get_usaha();
            } else {
                txt = "Tidak";
            }
        }
    });
}

function onDeviceReady() {
    init_localstorage();

    $(document).ajaxStart(function () {
        $("#loading").show();
    });

    $(document).ajaxComplete(function () {
        $("#loading").hide();
    });

    $(document).ajaxError(function () {
        alert('Koneksi Gagal Mohon Periksa Jaringan Anda');
    });


    var myElement = document.getElementById('mySidenav');
    var mc = new Hammer(myElement);
    mc.on("panleft panright tap press", function (ev) {
        if (ev.type == 'panleft') {
            closeNav();
        }
    });

    var myElement = document.body;
    var mc2 = new Hammer(document);
    mc2.on("panleft panright tap press", function (ev) {
        if (ev.type == 'panright' && ev.center.x <= 50 && ev.center.x > 0) {
            openNav();
        }
    });



    $('#printer').click(function () {
        menu_item = $(this);


        if (!menu_item.hasClass('active')) {
            $.get('page/printer.html', function (data) {
                $('#content').html(data);
            });
        }
        closeNav();
        menu_item.addClass('active');
        menu_item.siblings().removeClass('active');
    });

    $('#pesan').click(function () {
        menu_item = $(this);

        if (!menu_item.hasClass('active')) {
            $.get('page/pesan/pesan.html', function (data) {
                $('#content').html(data);
            });
        }
        closeNav();
        menu_item.addClass('active');
        menu_item.siblings().removeClass('active');
    });

    $('#tagihan').click(function () {
        menu_item = $(this);

        if (!menu_item.hasClass('active')) {
            $.get('page/tagihan.html', function (data) {
                $('#content').html(data);
            });
        }
        closeNav();
        menu_item.addClass('active');
        menu_item.siblings().removeClass('active');
    });




}

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-full-width",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "0",
    "hideDuration": "0",
    "timeOut": "0",
    "extendedTimeOut": "0",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}




function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
    $('#menu-container').show('slow');
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    $('#menu-container').hide();

}


