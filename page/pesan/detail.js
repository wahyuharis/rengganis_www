$(document).ready(function () {
    $('#title').html('Transaksi - Nota');

    is_login();

    var hostname_other = localStorage.getItem('hostname_other');

    var data_usaha = JSON.parse(localStorage.getItem('usaha'));

    var foto_usaha = '';
    if (data_usaha.logo_print == null) {
        foto_usaha = hostname_other + 'logo_usaha/blank.png';
    } else if (data_usaha.logo_print == '') {
        foto_usaha = hostname_other + 'logo_usaha/blank.png';
    } else if (data_usaha.logo_print == undefined) {
        foto_usaha = hostname_other + 'logo_usaha/blank.png';
    } else {
        foto_usaha = hostname_other + 'logo_usaha/' + data_usaha.logo_print;
    }

    $('#logo_usaha').attr('src', foto_usaha);

    get_penjualan();

    $('#print').click(function () {

        var address = localStorage.getItem('default_printer');

        if (address == undefined || address == null || address == '') {
            $('#print-modal').modal('show');
            list_device();
        }

        window.DatecsPrinter.connect(address,
                function () {
                    print_act0();
                },
                function () {
                    if (confirm("Koneksi Ke Printer Gagal Cari Perangkat Lain ?")) {
                        txt = "Ya";
                        $('#print-modal').modal('show');
                        list_device();
                    } else {
                        txt = "Tidak";
                    }
                }
        );
    });

    $('#refresh-printer').click(function () {
        list_device();
    });

    $('#bluetooth-setting').click(function () {
        open_bluetooth_setting();
    });

    $('#print-act').click(function () {
        print_act0();
    });

    function print_act0() {
        var address = localStorage.getItem('default_printer');

        window.DatecsPrinter.connect(address,
                function () {
                    Print_act2();
                },
                function () {
                    alert(JSON.stringify(error));
                }
        );
    }

    function Print_act2() {
        var image = new Image();
        var logo_usaha = $('#logo_usaha').attr('src');

        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.height = 100;
            canvas.width = 100;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, 100, 100);
            var imageData = canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpg|jpeg);base64,/, ""); //remove mimetype

            window.DatecsPrinter.printImage(
                    imageData, //base64
                    canvas.width,
                    canvas.height,
                    1,
                    function () {
                        linefeed();
                    },
                    function (error) {
                        alert(JSON.stringify(error));
                    }
            )
        };
        image.src = logo_usaha;
    }
    function linefeed() {
        window.DatecsPrinter.feedPaper(1,
                function () {
                    Print_text();
                }
        );
    }

    function Print_text() {
        var print_content = $('#print_content').html();

        window.DatecsPrinter.printText('{left}' + print_content + "{br}{br}{br}", 'ISO-8859-1',
                function () {
                    print_disconect();
                }
        );
    }

    function print_disconect() {
        window.DatecsPrinter.disconnect(function () {
            //succes
        }, function () {
            //error
            alert('Disconect Gagal');
        });
    }

    document.addEventListener("resume", On_resume, false);
    function On_resume() {
        list_device();
    }

    window.addEventListener('BluetoothStatus.disabled', function () {
        if (confirm("Bluetooth Tidak Aktif,Nyalakan ?")) {
            txt = "Ya";
            open_bluetooth_setting();
        } else {
            txt = "Tidak";
        }

    });

    function open_bluetooth_setting() {
        if (window.cordova && window.cordova.plugins.settings) {
            window.cordova.plugins.settings.open("bluetooth", function () {
//                console.log('opened settings');
            },
                    function () {
                        alert('Membuka Akses sistem Bluetooth Gagal');
                    }
            );
        } else {
            alert('Akses sistem Gagal');
        }
    }

    function list_device() {
        window.DatecsPrinter.listBluetoothDevices(
                function (devices) {
                    var append = '';
                    $('#printer-list').html('');

                    for (var i = 0; i < devices.length; i++) {
                        append = push_radio(devices[i].address, devices[i].name, i);
                        $('#printer-list').append(append);
                    }
                    change_printer_handler();

                },
                function (error) {
                    $('#console').append(JSON.stringify(error)) + "\n";

                    if (confirm("Tidak Ditemukan Perangkat, Buka Bluetooth ?")) {
                        txt = "Ya";
                        open_bluetooth_setting();
                    } else {
                        txt = "Tidak";
                    }

                }
        );
    }

    function push_radio(address, name, index) {
        var html = '<div class="form-check mb-2 mt-2 border-top">'
                + '<div class="mb-2 mt-2"  >'
                + '<input class="form-check-input" type="radio" value="' + address + '" id="' + 'printer_' + index + '" name="printer_def"   >'
                + '<label class="form-check-label" style="width:100%" for="' + 'printer_' + index + '" >'
                + name
                + '</label>'
                + '</div>'
                + '</div>';

        return html;
    }

    function change_printer_handler() {
        $('input[name=printer_def]').change(function () {
            var mac_printer = $(this).val();

            localStorage.setItem('default_printer', mac_printer);

            $('#default_printer').val(mac_printer);
        });
    }


    $('#kembali').click(function () {
        localStorage.setItem('cart', '');
        $.get('page/pesan/pesan.html', function (data) {
            $('#content').html(data);
        });
    });

    document.addEventListener("backbutton", onBackKeyDown, false);
    function onBackKeyDown() {
        $.get('page/pesan/pesan.html', function (data) {
            $('#content').html(data);
        });
    }


    function get_penjualan() {
        var id_penjualan = localStorage.getItem('id_penjualan');

        var url = localStorage.getItem('hostname') + 'penjualan/penjualan/detail/';
        var token = localStorage.getItem('token');

        $.ajax({
            url: url,
            type: 'post',
            data: {
                'id_penjualan': id_penjualan,
                'token': token,
            },
            crossDomain: true,
            success: function (result) {
                if (result.status) {

                    var data_print = result.data.text;

                    $('#print_content').html(data_print);

                } else {
                    alert(result.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (confirm("Koneksi Gagal Coba lagi ?")) {
                    txt = "Ya";
                    get_penjualan();
                } else {
                    txt = "Tidak";
                }
                setTimeout(function () {
                    loading.rewrite();
                }, 500);
            }
        });
    }



});

function is_login() {
    var token = localStorage.getItem('token');
    var hostname = localStorage.getItem('hostname');

    $.ajax({
        url: hostname + 'auth/auth/is_login',
        type: 'post',
        crossDomain: true,
        data: {
            'token': token
        },
        success: function (result) {
            data = result.data;
            if (result.status) {
                //pass
            } else {
                alert(result.message);
                window.location.href = 'index.html';
            }
        }, error(err) {
            alert('koneksi gagal periksa koneksi anda' + "\n" + JSON.stringify(err));
            loading.rewrite();
        }
    });
}
