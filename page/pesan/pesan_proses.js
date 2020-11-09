function produk_cart_row(id_produk, sku, nama_produk, harga_produk, foto, qty, disc) {
    var self = this;

    self.id_produk = ko.observable(id_produk);
    self.sku = ko.observable(sku);

    self.nama_produk = ko.observable(nama_produk);
    self.harga_produk = ko.observable(harga_produk);

    self.foto = ko.observable(foto);

    self.qty = ko.observable(qty);
    self.disc = ko.observable(disc);

    self.harga_disc = ko.observable(false);

    self.id_element = ko.computed(function () {
        var output = '';

        output = "produk_list_" + self.id_produk();

        return output;
    });

    self.total = ko.computed(function () {
        var total = 0;
        var disc = 0;
        total = curency_to_float(self.qty()) * curency_to_float(self.harga_produk());

        disc = (curency_to_float(self.disc()) * total) / 100;

        total = total - disc;

        return float_to_currency(total);
    });
}

function opt_meja(id_meja, nomor_meja) {
    var self = this;

    self.id_meja = ko.observable(id_meja);
    self.nomor_meja = ko.observable(nomor_meja);

}

function opt_rekening(id_rekening, nama_rekening, no_rekening, qr_code) {
    var self = this;

    self.id_rekening = ko.observable(id_rekening);
    self.nama_rekening = ko.observable(nama_rekening);
    self.no_rekening = ko.observable(no_rekening);
    self.qr_code = ko.observable(qr_code);

}

function opt_pajak(id_pajak, potongan, nama_pajak) {
    var self = this;

    self.id_pajak = ko.observable(id_pajak);
    self.potongan = ko.observable(potongan);
    self.nama_pajak = ko.observable(nama_pajak + ' ' + potongan + '%');
}

function Pesan_proses_model() {
    var self = this;

    self.nama_customer = ko.observable('');
    self.whatsapp = ko.observable('');

    self.id_pajak = ko.observable('');
    self.pajak_persen = ko.observable(0);
    self.opt_pajak = ko.observableArray([]);

    self.bayar_nanti = ko.observable(false);
    self.opt_meja = ko.observableArray([]);
    self.opt_rekening = ko.observableArray([]);
    self.id_meja = ko.observable('');
    self.id_rekening = ko.observable('');

    self.f_uang_pas = function () {
        var total_all = self.total_all();
        self.bayar(total_all);

    }

    self.f_uang_10 = function () {
        self.bayar('10,000.00');
    }

    self.f_uang_20 = function () {
        self.bayar('20,000.00');

    }

    self.f_uang_50 = function () {
        self.bayar('50,000.00');

    }
    self.f_uang_100 = function () {
        self.bayar('100,000.00');
    }

    self.bayar_opt_toggle = ko.observable(false);

    self.bayar_opt_toggle_true = function () {
        self.bayar_opt_toggle(true);
    }

    self.bayar_opt_toggle_false = function () {
        self.bayar_opt_toggle(false);
    }


    self.bayar = ko.observable('');

    self.cart = ko.observableArray([]);

    self.id_pajak.subscribe(function () {
        var pajak_persen = 0;
        for (var i = 0; i < self.opt_pajak().length; i++) {
            row = self.opt_pajak()[i];

            if (row.id_pajak() == self.id_pajak()) {
                pajak_persen = row.potongan();
            }

            self.pajak_persen(pajak_persen);
        }
    });


    self.get_pajak = function () {

        var url = localStorage.getItem('hostname') + 'master/pajak';
        var token = localStorage.getItem('token');

        $.ajax({
            url: url,
            type: 'post',
            crossDomain: true,
            data: {
                'token': token,
            }, success: function (result) {

                if (result.status) {
                    var data = result.data.opt_pajak;
                    var row;
                    for (var i = 0; i < data.length; i++) {
                        row = data[i];
// opt_pajak(id_pajak, potongan,nama_pajak) {
                        self.opt_pajak.push(new opt_pajak(row.id_pajak, row.potongan, row.nama_pajak));

                        self.id_pajak(result.data.used.id_pajak);
                        self.pajak_persen(result.data.used.potongan)
                    }
                } else {
                    alert(result.message);
                }

            }, error: function (err) {
                if (confirm("Koneksi Gagal Coba lagi ?")) {
                    txt = "Ya";
                    self.get_pajak();
                } else {
                    txt = "Tidak";
                }
            }
        });
    }

    self.get_meja = function () {
        //http://localhost/rengganis_api/master/meja

        var url = localStorage.getItem('hostname') + 'master/meja';
        var token = localStorage.getItem('token');

        $.ajax({
            url: url,
            type: 'post',
            crossDomain: true,
            data: {
                'token': token,
            }, success: function (result) {

                if (result.status) {
                    var data = result.data;
                    var row;
                    for (var i = 0; i < data.length; i++) {
                        row = data[i];
//                        opt_rekening(id_rekening,nama_rekening,no_rekening,qr_code){


                        self.opt_meja.push(new opt_meja(row.id_meja, row.nomor_meja));
                    }
                } else {
                    alert(result.message);
                }

            }, error: function (err) {
                if (confirm("Koneksi Gagal Coba lagi ?")) {
                    txt = "Ya";
                    self.get_meja();
                } else {
                    txt = "Tidak";
                }
            }
        });
    }

    self.get_rekening = function () {
        var url = localStorage.getItem('hostname') + 'kas/m_rekening';
        var token = localStorage.getItem('token');

        $.ajax({
            url: url,
            type: 'post',
            crossDomain: true,
            data: {
                'token': token,
            }, success: function (result) {

                if (result.status) {
                    var data = result.data;

                    var row;
                    for (var i = 0; i < data.length; i++) {
                        row = data[i];
                        self.opt_rekening.push(new opt_rekening(row.id_rekening, row.nama_rekening, '', ''));
                    }
                } else {
                    alert(result.message);
                }

            }, error: function (err) {
                if (confirm("Koneksi Gagal Coba lagi ?")) {
                    txt = "Ya";
                    self.get_rekening();
                } else {
                    txt = "Tidak";
                }
            }
        });
    }

    self.delete_cart = function (row) {
        self.cart.remove(row);
    }

    self.bayar_nanti.subscribe(function () {
        var bayar_nanti = self.bayar_nanti();

        if (bayar_nanti) {
            $('#bayar_container').slideUp();
        } else {
            $('#bayar_container').slideDown();
        }
    });

    self.minus_qty = function (row) {
        for (var i = 0; i < self.cart().length; i++) {
            if (self.cart()[i].id_produk() == row.id_produk()) {
                var qty = curency_to_float(row.qty()) - 1;
                self.cart()[i].qty(qty);

                if (qty <= 0) {
                    self.cart.remove(row);
                }

            }
        }
    }

    self.plus_qty = function (row) {
        for (var i = 0; i < self.cart().length; i++) {
            if (self.cart()[i].id_produk() == row.id_produk()) {
                var qty = curency_to_float(row.qty()) + 1;
                self.cart()[i].qty(qty);
            }
        }
    }

    self.check_cart_available = function () {
        var cart_json = localStorage.getItem('cart');

        var cart_parsed = [];
        var cart_arr = [];

        try {
            cart_parsed = JSON.parse(cart_json);
            cart_arr = cart_parsed.cart;
        } catch (e) {
            console.log(e);
        }

        if (cart_arr.length > 0) {
            var row = null;
            for (var i = 0; i < cart_arr.length; i++) {
                row = cart_arr[i];
//                self.cart.push(new produk_cart_row(id_produk, sku, nama_produk, harga_format, foto, 1, 0));
                self.cart.push(new produk_cart_row(row.id_produk, row.sku, row.nama_produk, row.harga_produk, row.foto, row.qty, row.disc));

            }
        }

    }

    self.sub_total = ko.computed(function () {
        var output = 0;
        var row;
        var total = 0;
        var total_row;
        for (var i = 0; i < self.cart().length; i++) {
            row = self.cart()[i];
            total_row = curency_to_float(row.qty()) * curency_to_float(row.harga_produk());
            total = total + total_row;
        }
        output = float_to_currency(total);
        return output;
    });

    self.disc_total = ko.computed(function () {
        var output = 0;
        var row;
        var total = 0;
        var total_row;
        var disc = 0;
        for (var i = 0; i < self.cart().length; i++) {
            row = self.cart()[i];
            disc = curency_to_float(row.disc());
            total_row = curency_to_float(row.qty()) * curency_to_float(row.harga_produk());
            total_row = (total_row * disc) / 100;
            total = total + total_row;
        }
        output = float_to_currency(total);
        return output;
    });

    self.pajak_nominal = ko.computed(function () {
        var output = 0;
        var sub_total = curency_to_float(self.sub_total());
        var disc_total = curency_to_float(self.disc_total());

        var total_kotor = 0;
        total_kotor = sub_total - disc_total;

        output = (total_kotor * curency_to_float(self.pajak_persen())) / 100;

        output = float_to_currency(output);
        return output;

    });

    self.total_all = ko.computed(function () {
        var output = 0;

        output = curency_to_float(self.sub_total()) - curency_to_float(self.disc_total()) + curency_to_float(self.pajak_nominal());

        return float_to_currency(output);
    });

    self.kembalian = ko.computed(function () {
        var output = '0';
        var tagihan = curency_to_float(self.total_all());

        output = curency_to_float(self.bayar()) - tagihan;

        if (output < 0) {
            output = 0;
        }

        output = float_to_currency(output);

        return output;
    });

    self.get_pajak();
    self.get_meja();
    self.check_cart_available();
    self.get_rekening();

}

ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).slideDown() : $(element).slideUp();
    }
};

$('#daftar_pesanan').ready(function () {
    $('#title').html('Transaksi - Pembayaran');
    
    is_login();
    
    $(window).scrollTop(0);

    var cart_json = localStorage.getItem('cart');
    console.log(JSON.parse(cart_json));

    ko.applyBindings(new Pesan_proses_model(), document.getElementById("daftar_pesanan"));


    $('#kembali').click(function () {
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

    $('#batal').click(function () {

        if (confirm("Batalkan Transaksi (Cart Dikosongkan) ?")) {
            txt = "Ya";
            localStorage.setItem('cart', '{"cart":[]}');
            $.get('page/pesan/pesan.html', function (data) {
                $('#content').html(data);
            });
        } else {
            txt = "Tidak";
        }

    });

    $('#simpan').click(function () {
        save();
    });

    function save() {
        var data = $('#ko_output').val();
        var data_arr = JSON.parse(data);
        
        console.log(data);


        var url = localStorage.getItem('hostname') + 'penjualan/penjualan/submit/';
        var token = localStorage.getItem('token');

        var loading = new SubmitLoading();
        loading.set_attr('#simpan');
        loading.write();

        $.ajax({
            url: url,
            type: 'post',
            crossDomain: true,
            data: {
                'ko_output': data,
                'token': token,
            },
            success: function (result) {
                if (result.status) {

                    console.log(result);
                    localStorage.setItem('id_penjualan', result.data.id_penjualan);
                    localStorage.setItem('cart', null);


                    $.get('page/pesan/detail.html', function (data) {
                        $('#content').html(data);
                    });


                } else {
                    alert(result.message);
                }

                setTimeout(function () {
                    loading.rewrite();
                }, 500);

            },
            error: function (err, err2) {
                if (confirm("Koneksi Gagal Coba lagi ?")) {
                    txt = "Ya";
                    save();
                } else {
                    txt = "Tidak";
                }
                setTimeout(function () {
                    loading.rewrite();
                }, 500);
            }
        });
    }


    format();
    $("body").on('DOMSubtreeModified', "#daftar_pesanan", function () {
        format();
    });

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
