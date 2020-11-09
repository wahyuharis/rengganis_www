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

    var myElement = document.body;
    var mc2 = new Hammer(document);
    mc2.on("panleft panright tap press", function (ev) {
        if (ev.type == 'panright' && ev.center.x <= 50 && ev.center.x > 0) {
            openNav();
        }
    });


//    document.addEventListener("touchstart", handleStart, false);
//    document.addEventListener("touchend", handleEnd, false);
//    document.addEventListener("touchcancel", handleCancel, false);
//    document.addEventListener("touchmove", handleMove, false);
//
//    function handleStart(ev) {
//        console.log(ev);
//    }
//    function handleEnd(ev) {
//        console.log(ev);
//    }
//    function handleCancel(ev) {
//        console.log(ev);
//    }
//    function handleMove(ev) {
//        console.log(ev.touches[0]);
//    }


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


    set_profile_usaha();

}

function init_localstorage() {
    var hostname = glob_hostname;
    var hostname_foto = glob_hostname_foto;
    var hostname_other = glob_hostname_other;


    localStorage.setItem('hostname', hostname);
    localStorage.setItem('hostname_foto', hostname_foto);
    localStorage.setItem('hostname_other', hostname_other);
}

function set_profile_usaha() {
    var usaha = localStorage.getItem('usaha');
    usaha_arr = JSON.parse(usaha);
//    console.log(usaha_arr);
    var outlet = localStorage.getItem('outlet');
    outlet_arr = JSON.parse(outlet);


    var foto_usaha = localStorage.getItem('hostname_other') + '/logo_usaha/' + usaha_arr.logo;
    console.log(usaha_arr);
    

    $('#img-profile').attr('src', foto_usaha);
    $('#label_1').html(usaha_arr.nama_usaha);
    $('#label_2').html(outlet_arr.nama_outlet + " - "+ outlet_arr.kota );

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
    document.getElementById("mySidenav").style.left = "0";
//    $('#menu-container').animate({opacity: 1}, 1000);
//    $('#profile-container').animate({opacity: 1}, 1000);
//    var width = $(window).width();
//    alert(width);

//    $('#mySidenav').animate({left: 0}, 5);

}

function closeNav() {
//    $('#menu-container').css('opacity',0);
//    $('#profile-container').css('opacity',0);
    document.getElementById("mySidenav").style.left = "-100%";
//    $('#mySidenav').animate({left: -100}, 1000);
//    var width = $(window).width();
//    var left2=width * -1;
//    alert(width);

//    $('#mySidenav').animate({left: '-100%'}, 5);
}


