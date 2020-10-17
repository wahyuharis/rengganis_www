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

    self.cart_dont_show_again = ko.observable(false);
    self.cart = ko.observableArray([]);

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
    }

    self.plus_qty = function (row) {
        for (var i = 0; i < self.cart().length; i++) {
            if (self.cart()[i].id_produk() == row.id_produk()) {
                var qty = curency_to_float(row.qty()) + 1;
                self.cart()[i].qty(qty);
            }
        }
    }


    self.clear_nama_produk = function () {
        self.produk_list([]);
        self.limit(5);
        self.start(0);
        $("#loading").show();
        self.load_data();
        $("#loading").hide();

    }

    self.clear_id_kategori = function () {
        self.produk_list([]);
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
                    var result = [];
                    result = data.data;
                    
                    if(result.length<1){
                        self.start(start-limit);
                    }

                    //produk_row(id_produk, sku,nama_produk, harga_produk) {
                    var row = [];
                    var foto = '';
                    for (var i = 0; i < result.length; i++) {
                        row = result[i];
                        foto = url_foto + '/' + row.foto;
                        self.produk_list.push(new produk_row(row.id_produk, row.sku, row.nama_produk, row.harga, foto));
                    }
                }
            }, error: function (err) {
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

    self.delete_cart = function (row) {
        self.cart.remove(row);
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
    })

    self.opt_kategori.push(new kategori_row('', 'Semua Kategori...'));
    self.load_kategori();
    self.load_data();

}



$('#modul_pesan').ready(function () {
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

    $('#cart-btn').click(function () {
        $('#cart-modal').modal('show');
    });


    $('#proses_pesanan').click(function () {
        $('#cart-modal').modal('hide');

        $('#cart-modal').on('hidden.bs.modal', function (e) {
            // do something...

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

