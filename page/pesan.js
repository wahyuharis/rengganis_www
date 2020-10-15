function produk_row(id_produk, nama_produk, harga_produk, foto) {
    var self = this;

    self.id_produk = ko.observable(id_produk);
    self.nama_produk = ko.observable(nama_produk);
    self.harga_produk = ko.observable(harga_produk);

    self.foto = ko.observable(foto);

    self.harga_format = ko.computed(function () {
        harga_format = float_to_currency(self.harga_produk());
        return harga_format;
    });
}

function produk_cart_row(id_produk, nama_produk, harga_produk, foto, qty) {
    var self = this;

    self.id_produk = ko.observable(id_produk);
    self.nama_produk = ko.observable(nama_produk);
    self.harga_produk = ko.observable(harga_produk);

    self.foto = ko.observable(foto);

    self.qty = ko.observable(qty);

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
    self.append = ko.observable(false);

    self.cart_dont_show_again = ko.observable(false);
    self.cart = ko.observableArray([]);

    self.total_cart = ko.computed(function () {
        var total = 0;

        total = self.cart().length;

        return total;
    });


    self.clear_nama_produk = function () {
        self.append(false);
        self.limit(5);
        self.start(0);
        self.load_data();
    }

    self.clear_id_kategori = function () {
        self.append(false);
        self.limit(5);
        self.start(0);
        self.load_data();
    }

    self.load_data = function () {
        var url = localStorage.getItem('hostname') + '/produk';
        var url_foto = localStorage.getItem('hostname_foto');

        var username = localStorage.getItem('username');
        var password = localStorage.getItem('password');
        var nama_produk = self.nama_produk();
        var id_kategori = self.id_kategori();
        var limit = self.limit();
        var start = self.start();
        var append = self.append();

        $.ajax({
            url: url,
            type: 'post',
            crossDomain: true,
            data: {
                'username': username,
                'password': password,
                'nama_produk': nama_produk,
                'id_kategori': id_kategori,
                'start': start,
                'limit': limit,
            },
            success: function (data) {
                if (data.status) {

                    if (!append) {
                        self.produk_list([]);
                    }

                    var result = [];
                    result = data.data;
                    //produk_row(id_produk, nama_produk, harga_produk) {
                    var row = [];
                    var foto = '';
                    for (var i = 0; i < result.length; i++) {
                        row = result[i];
                        foto = url_foto + '/' + row.foto;
                        self.produk_list.push(new produk_row(row.id_produk, row.nama_produk, row.harga, foto));
                    }
                }
            }
        });
    }

    self.load_kategori = function () {
        var url = localStorage.getItem('hostname') + '/produk/kategori';

        var username = localStorage.getItem('username');
        var password = localStorage.getItem('password');

        $.ajax({
            url: url,
            type: 'post',
            crossDomain: true,
            data: {
                'username': username,
                'password': password,
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
                }
            }
        });
    }

    self.cari_produk = function () {
        self.append(false);
        self.limit(5);
        self.start(0);
        self.load_data();
    }

    self.scroll_bottom = function () {
        var start = self.start();
        var limit = self.limit();

        start = start + limit;
        self.start(start);
        self.append(true);

        self.load_data();
    }

    self.cart_add = function (row) {
//        console.log(row);
        var cart_dont_show_again = self.cart_dont_show_again();

        var id_produk = row.id_produk();
        var nama_produk = row.nama_produk();
        var harga_produk = row.harga_produk();
        var harga_format = row.harga_format();
        var foto = row.foto();
//  produk_cart_row(id_produk, nama_produk, harga_produk, foto,qty) 


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
            self.cart.push(new produk_cart_row(id_produk, nama_produk, harga_format, foto, 1));
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

    self.delete_cart = function (row) {
        self.cart.remove(row);
    }

    self.opt_kategori.push(new kategori_row('', 'Semua Kategori...'));
    self.load_kategori();
    self.load_data();

}

$('#modul_pesan').ready(function () {
    ko.applyBindings(new Module_pesan(), document.getElementById("modul_pesan"));

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            var context = ko.contextFor(document.getElementById("modul_pesan"));
            context.$data.scroll_bottom();
        }
    });

    format();
    $("body").on('DOMSubtreeModified', "#modul_pesan", function () {
        format();
    });


    var myElement = document.getElementById('cart-modal');
    var mc = new Hammer(myElement);
    mc.get('swipe').set({direction: Hammer.DIRECTION_ALL});
    mc.on("swipeup", function () {
        $('#cart-modal').modal('hide');
    });

    $('#cart-btn').click(function () {
        $('#cart-modal').modal('show');
    });

})