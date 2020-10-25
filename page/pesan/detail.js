function Printer_model() {
    var self = this;

    self.printer_list = ko.observableArray([
        {'address': '123123123', 'name': 'rpp-02'},
        {'address': '123123123', 'name': 'rpp-03'},
        {'address': '123123123', 'name': 'rpp-04'},
        {'address': '123123123', 'name': 'rpp-05'},
    ]);
}

$(document).ready(function () {
    ko.applyBindings(new Printer_model(), document.getElementById("detail_page"));

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