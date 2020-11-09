function produk_row(id_produk, sku, nama_produk, harga_produk, foto) {
    var self = this;

    self.id_produk = ko.observable(id_produk);
    self.sku = ko.observable(sku);
    self.nama_produk = ko.observable(nama_produk);
    self.harga_produk = ko.observable(harga_produk);

    self.foto = ko.observable(foto);

    self.harga_format = ko.computed(function () {
        harga_format = float_to_currency(self.harga_produk());
        return harga_format;
    });
}

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

function kategori_row(id_kategori, nama_kategori) {
    var self = this;

    self.id_kategori = ko.observable(id_kategori);
    self.nama_kategori = ko.observable(nama_kategori);
}

function Module_pesan() {
    var self = this;

    self.nama_produk = ko.observable('');
    self.id_kategori = ko.observable('');
    self.produk_list = ko.observableArray([]);

    self.opt_kategori = ko.observableArray([]);

    self.start = ko.observable(0);
    self.limit = ko.observable(5);

    self.cart_dont_show_again = ko.observable(true);
    self.cart = ko.observableArray([]);

    self.update_cart_session = function () {
        var cart_sess = ko.toJSON(self);
        localStorage.setItem('cart', cart_sess);
    }

    self.produk_list_add = function (element, index, data) {
        if (element.nodeType === 1) {
            $(element).css('opacity', 0);
            var interval = (($(element).index() + 1) * 100);

            setTimeout(function () {
                $(element).animate({opacity: 1});
            }, interval);
        }

        self.update_cart_session();
    };

    self.qount_cart = ko.computed(function () {
        var total = 0;

        total = self.cart().length;

        return total;
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
        self.update_cart_session();

    }

    self.plus_qty = function (row) {
        for (var i = 0; i < self.cart().length; i++) {
            if (self.cart()[i].id_produk() == row.id_produk()) {
                var qty = curency_to_float(row.qty()) + 1;
                self.cart()[i].qty(qty);
            }
        }

        self.update_cart_session();

    }


    self.clear_nama_produk = function () {
        self.nama_produk('');
        self.produk_list([]);
        self.limit(5);
        self.start(0);
        self.load_data();
    }

    self.clear_id_kategori = function () {
        self.id_kategori('');
        self.produk_list([]);
        self.limit(5);
        self.start(0);
        self.load_data();
    }

    self.load_data = function () {
        var url = localStorage.getItem('hostname') + '/produk/produk';
        var url_foto = localStorage.getItem('hostname_foto');


        var token = localStorage.getItem('token');
        var nama_produk = self.nama_produk();
        var id_kategori = self.id_kategori();
        var limit = self.limit();
        var start = self.start();

        $.ajax({
            url: url,
            type: 'post',
            crossDomain: true,
            data: {
                'token': token,
                'nama_produk': nama_produk,
                'id_kategori': id_kategori,
                'start': start,
                'limit': limit,
            },
            success: function (data) {
                if (data.status) {
                    var result = [];
                    result = data.data;

                    if (result.length < 1) {
                        self.start(start - limit);
                    }

                    var row = [];
                    var foto = '';
                    for (var i = 0; i < result.length; i++) {
                        row = result[i];
                        foto = url_foto + '' + row.foto;
                        self.produk_list.push(new produk_row(row.id_produk, row.sku, row.nama_produk, row.harga, foto));
                    }
                } else {
                    alert(data.message);
                }
            }, error: function (err) {

                if (confirm("Koneksi Gagal Coba lagi ?")) {
                    txt = "Ya";
                    self.load_data();
                } else {
                    txt = "Tidak";
                }
            }

        });
    }

    self.load_kategori = function () {
        var url = localStorage.getItem('hostname') + '/produk/produk/kategori';
        var token = localStorage.getItem('token');

        $.ajax({
            url: url,
            type: 'post',
            crossDomain: true,
            data: {
                'token': token,
            },
            success: function (data) {
                if (data.status) {
                    var result = [];
                    result = data.data;
                    var row = [];
                    for (var i = 0; i < result.length; i++) {
                        row = result[i];
                        self.opt_kategori.push(new kategori_row(row.id_kategori, row.nama_kategori));
                    }
                } else {
                    alert(data.message);
                }
            }, error: function (err) {
                if (confirm("Koneksi Gagal Coba lagi ?")) {
                    txt = "Ya";
                    self.load_kategori();
                } else {
                    txt = "Tidak";
                }
            }
        });
    }

    self.cari_produk = function () {
        self.produk_list([]);
        self.limit(5);
        self.start(0);
        self.load_data();
    }

    self.scroll_bottom = function () {
        var start = self.start();
        var limit = self.limit();

        start = start + limit;
        self.start(start);

        console.log(self.start() + "");

        self.load_data();
    }

    self.cart_add = function (row) {
//        console.log(row);
        var cart_dont_show_again = self.cart_dont_show_again();

        var id_produk = row.id_produk();
        var sku = row.sku();
        var nama_produk = row.nama_produk();
        var harga_produk = row.harga_produk();
        var harga_format = row.harga_format();
        var foto = row.foto();
//  produk_cart_row(id_produk, sku,nama_produk, harga_produk, foto,qty) 


        var add = true;
        var id_produk_add = null
        for (var i = 0; i < self.cart().length; i++) {
            id_produk_add = self.cart()[i].id_produk();
            if (id_produk == id_produk_add) {
                toastr.warning('Produk Tsb Sudah Ada Dalam Daftar', 'Maaf');
                add = false;
            }
        }
        if (add) {
            self.cart.push(new produk_cart_row(id_produk, sku, nama_produk, harga_format, foto, 1, 0));
        }

        if (!cart_dont_show_again) {
            $('#cart-modal').modal('show');
        } else {
            if (add) {
                $('#cart-btn').tooltip('show');
                setTimeout(function () {
                    $('#cart-btn').tooltip('hide');
                }, 1000);
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

    self.delete_cart = function (row) {
        self.cart.remove(row);
        self.update_cart_session();
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

    self.total_all = ko.computed(function () {
        var output = 0;

        output = curency_to_float(self.sub_total()) - curency_to_float(self.disc_total());


        return float_to_currency(output);
    });

//    self.opt_kategori.push(new kategori_row('', 'Semua Kategori...'));
    self.load_kategori();
    self.load_data();
    self.check_cart_available();

}

$('#modul_pesan').ready(function () {
    is_login();
    
    $('#title').html('Transaksi - Pilih Produk');

    ko.applyBindings(new Module_pesan(), document.getElementById("modul_pesan"));

    $(window).scroll(function () {

    });

    $('#pagination-detect').on('inview', function (event, isInView) {
        if (isInView) {
            var context = ko.contextFor(document.getElementById("modul_pesan"));
            context.$data.scroll_bottom();
        } else {
            // element has gone out of viewport
        }
    });

    format();
    $("body").on('DOMSubtreeModified', "#modul_pesan", function () {
        format();
    });


    var myElement = document.getElementById('modal-swipe-up');
    var mc = new Hammer(myElement);
    mc.get('swipe').set({direction: Hammer.DIRECTION_ALL});
    mc.on("swipeup", function () {
        $('#cart-modal').modal('hide');
    });

    document.addEventListener("backbutton", onBackKeyDown, false);
    function onBackKeyDown() {
        $('#cart-modal').modal('hide');
    }


    $('#cart-btn').click(function () {
        $('#cart-modal').modal('show');
    });


    $('#proses_pesanan').click(function () {
        $('#cart-modal').modal('hide');

        $('#cart-modal').on('hidden.bs.modal', function (e) {
            var json = $('#daftar_pesanan').val();
            localStorage.setItem('cart', json);

            $.get('page/pesan/pesan_proses.html', function (data) {
                $('#content').html(data);
            });
        });
    });

    toastr.options.onShown = function () {
        var myElement = document.getElementById('toast-container');
        var mc = new Hammer(myElement);
        mc.on("panleft panright tap press", function (ev) {
            if (ev.type == 'panleft' || ev.type == 'panright') {
                toastr.clear();
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