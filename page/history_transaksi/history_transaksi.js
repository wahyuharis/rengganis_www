function penjualan_row(id_penjualan, kode_transaksi, nama_outlet, atas_nama, whatsapp, total_transaksi_bersih, status_bayar) {
    var self = this;
    self.id_penjualan = ko.observable(id_penjualan);
    self.kode_transaksi = ko.observable(kode_transaksi);
    self.nama_outlet = ko.observable(nama_outlet);
    self.atas_nama = ko.observable(atas_nama);
    self.whatsapp = ko.observable(whatsapp);
    self.total_transaksi_bersih = ko.observable(total_transaksi_bersih);
    self.status_bayar = ko.observable(status_bayar);
}


function History_transaksi_model() {
    var self = this;

    self.f_kode_transaksi = ko.observable('');
    self.f_nama_outlet = ko.observable('');
    self.f_atas_nama = ko.observable('');
    self.f_whatsapp = ko.observable('');

    self.history_transaksi_list = ko.observableArray([]);

    self.start = ko.observable(0);
    self.limit = ko.observable(5);

    self.get_history_transaksi_list = function () {
        var url = localStorage.getItem('hostname') + '/penjualan/penjualan/get_list';
        var token = localStorage.getItem('token');
        var start = self.start();
        var limit = self.limit();

        $.ajax({
            url: url,
            type: 'post',
            crossDomain: true,
            data: {
                'token': token,
                'start': start,
                'limit': limit,
            },
            success: function (data) {

            }
        });
    }

    self.get_history_transaksi_list();
}

$('#history_transaksi').ready(function () {
    ko.applyBindings(new History_transaksi_model(), document.getElementById("history_transaksi"));

});