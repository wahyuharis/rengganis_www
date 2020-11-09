var hostname = glob_hostname;


//document.addEventListener('deviceready', onDeviceReady, false);

$(document).ready(function () {

    onDeviceReady();

});

//$('#login').ready(function () {
////    onDeviceReady();
//});


function onDeviceReady() {
    var username = '';
    var password = '';

    is_login();

    $('#form_login').submit(function (e) {
        e.preventDefault();
    });

    $('#login_submit').click(function () {
        username = $('#username').val();
        password = $('#password').val();

        login(username, password);
    });

    function login(username, password) {

        var loading = new SubmitLoading();
        loading.set_attr('#login_submit');
        loading.write();

        $.ajax({
            url: hostname + 'auth/auth/login',
            type: 'post',
            crossDomain: true,
            data: {
                'username': username,
                'password': password,
            },
            success: function (result) {
                data = result.data;
                if (result.status) {

                    localStorage.setItem('token', data.token);
                    localStorage.setItem('id_usaha', data.id_usaha);
                    localStorage.setItem('id_outlet', data.id_outlet);
                    localStorage.setItem('usaha', JSON.stringify(data.usaha));
                    localStorage.setItem('outlet', JSON.stringify(data.outlet));
                    localStorage.setItem('user', JSON.stringify(data.user));

                    window.location.href = 'dash.html';
                } else if (data.error_code == 2) {
                    var r = confirm(result.message + "\n" + "Logout Device Lain ?");
                    if (r == true) {
                        login_force(username, password);
                    } else {
                        //nope
                    }
                } else {
                    alert(result.message);
                }
                loading.rewrite();
            }, error(err) {
                alert('koneksi gagal periksa koneksi anda' + "\n" + JSON.stringify(err));
                loading.rewrite();
            }
        });
    }

    function login_force(username, password) {
        $.ajax({
            url: hostname + 'auth/auth/login',
            type: 'post',
            crossDomain: true,
            data: {
                'username': username,
                'password': password,
                'logout_other': 1
            },
            success: function (result) {
                data = result.data;
                if (result.status) {

                    localStorage.setItem('token', data.token);
                    localStorage.setItem('id_usaha', data.id_usaha);
                    localStorage.setItem('id_outlet', data.id_outlet);
                    localStorage.setItem('usaha', JSON.stringify(data.usaha));
                    localStorage.setItem('outlet', JSON.stringify(data.outlet));
                    localStorage.setItem('user', JSON.stringify(data.user));

//                    console.log(data);
                    window.location.href = 'dash.html';
                } else {
                    alert(result.message);
                }
            }, error(err) {
                alert('koneksi gagal periksa koneksi anda' + "\n" + JSON.stringify(err));
                loading.rewrite();
            }
        });
    }




    $('#show-hide-pass').click(function () {
        var type = $('#password').attr('type')

        if (type == 'password') {
            $('#password').attr('type', 'text');

        } else {
            $('#password').attr('type', 'password');
        }

    });

}

function is_login() {
    var token = localStorage.getItem('token');

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

                localStorage.setItem('token', data.token);
                localStorage.setItem('id_usaha', data.id_usaha);
                localStorage.setItem('id_outlet', data.id_outlet);
                localStorage.setItem('usaha', JSON.stringify(data.usaha));
                localStorage.setItem('user', JSON.stringify(data.user));

//                    console.log(data);
                window.location.href = 'dash.html';
            } else {
//                alert(result.message);
            }
        }, error(err) {
            alert('koneksi gagal periksa koneksi anda' + "\n" + JSON.stringify(err));
            loading.rewrite();
        }
    });
}


