function logout() {
    var hostname = localStorage.getItem('hostname');
    var token=localStorage.getItem('token');


    $.ajax({
        url: hostname + 'auth/auth/logout',
        type: 'post',
        crossDomain: true,
        data: {
            'token': token,
        },
        success: function (result) {
            data = result.data;
            if (result.status) {

                localStorage.setItem('token', '');
                localStorage.setItem('id_usaha', '');
                localStorage.setItem('id_outlet', '');
                localStorage.setItem('usaha', '');
                localStorage.setItem('user', '');
                
                localStorage.setItem('message_succes','logout succes');

                window.location.href = 'index.html';
            }else {
                alert(result.message);
            }
            loading.rewrite();
        }, error(err) {
            alert('koneksi gagal periksa koneksi anda' + "\n" + JSON.stringify(err));
            loading.rewrite();
        }
    });

}

