function curency_to_float(str) {
    var myNumeral2 = numeral(str);

    return parseFloat(myNumeral2.value());
}

function float_to_currency(floatval) {
    floatval = parseFloat(floatval);
    return numeral(floatval).format("0,0.00");
}


function format() {
    $('.thousand').each(function () {
        num = $(this).val();
        num = numeral(num).format('0,0.00');
        $(this).val(num);
    });

    $('.thousand').keyup(function () {
        num = $(this).val();
        num = numeral(num).format();
        $(this).val(num);
    });
    
    $('.thousand').focusout(function () {
        num = $(this).val();
        num = numeral(num).format('0,0.00');
        $(this).val(num);
    });


    $('.number').keypress(function (event) {
        num = $(this).val();
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

    $('.number').focusout(function () {
        num = $(this).val();
        num = numeral(num).format('0,0.00');
        $(this).val(num);
    });

    $('.number').each(function () {
        num = $(this).val();
        num = numeral(num).format();
        $(this).val(num);
    });
}