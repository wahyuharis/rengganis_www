$(document).ready(function () {

    var hostname_other = localStorage.getItem('hostname_other');

    var data_usaha = JSON.parse(localStorage.getItem('usaha'));

    var foto_usaha = '';
    if (data_usaha.logo == null) {
        foto_usaha = hostname_other + 'logo_usaha/blank.png';
    } else if (data_usaha.logo == '') {
        foto_usaha = hostname_other + 'logo_usaha/blank.png';
    } else if (data_usaha.logo == undefined) {
        foto_usaha = hostname_other + 'logo_usaha/blank.png';
    } else {
        foto_usaha = hostname_other + 'logo_usaha/' + data_usaha.logo;
    }

    $('#logo_usaha').attr('src', foto_usaha);

    get_penjualan();

    $('#print').click(function () {
        $('#print-modal').modal('show');
        list_device();
    });

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
            
            localStorage.setItem('default_printer',mac_printer);
            
            $('#default_printer').val(mac_printer);
        });
    }


    $('#kembali').click(function () {
        localStorage.setItem('cart', '');
        $.get('page/pesan/pesan.html', function (data) {
            $('#content').html(data);
        });
    });


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