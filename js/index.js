//document.addEventListener('deviceready', onDeviceReady, false);
$(document).ready(function () {

    onDeviceReady();

});



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
            $.get('page/pesan.html', function (data) {
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
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

function init_localstorage() {
    var hostname = 'http://192.168.1.102/rengganis_api/';
    var hostname_foto = 'http://192.168.1.102/rengganis/uploads/';
    var username = 'kasir';
    var password = 'kasir';

    localStorage.setItem('hostname', hostname);
    localStorage.setItem('hostname_foto', hostname_foto);
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
}


function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
    $('#menu-container').show('slow');
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    $('#menu-container').hide();

}


