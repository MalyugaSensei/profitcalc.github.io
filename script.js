var mode, firstPrice = 0, secondPrice = 0, profitPerc = 0, profitUSD = 0, profitRUB = 0, rate = 0, Solution = 0, money = 0, mode = 0, i = 0, usd, eur;

i = 1;

rate = $.getJSON("https://www.cbr-xml-daily.ru/daily_json.js",
    function (data, textStatus, jqXHR) {
        usd = data.Valute.USD.Value;
        eur = data.Valute.EUR.Value;
        $('.usd').html(data.Valute.USD.Value + " USD");
        $('.eur').html(data.Valute.EUR.Value + " EUR");
    }
);

$('.option').on('click', function (e) {
    e.preventDefault();
    $('.change-options').hide();
    var option = $(this).attr('id');
    mode = option;
    changeOption(option);
});

$('.service-option').on('click', function (e) {
    e.preventDefault();
    $('.change-serv').hide();
    var servType = $(this).attr('id');
    changeService(servType);
});

$('.deposit-option').on( 'click', function (e) { 
    e.preventDefault();
    $('.change-deposit').hide();
    $('.input-price').show();
    $('.price-serv').before('Цена на сайте');
    $('.price-any').before('Цена в стиме');
    $('.text-message').html('Введите цены');
    var depType = $(this).attr('data-deposit-type');
    $('.calc').attr('data-deposit-type', depType);
});


$('.calc').on('click', function (e) {
    e.preventDefault();
    console.log(mode);
    firstPrice = $('.price-serv').val();
    secondPrice = $('.price-any').val();
    console.log($(this).attr('data-service-type'));
    switch ($(this).attr('data-service-type')) {
        case "dmarket" :
            var depType = $(this).attr('data-deposit-type');
            dmarket(depType, firstPrice, secondPrice, mode);
            break;
        case "steam" :
            steam(firstPrice, secondPrice, mode);
            break;
        case "dm-csanal" :
            dmarkCSanal(firstPrice, secondPrice, mode);
            break;
        case "waxpeer" :

            break;        
    }
});

function changeOption(option) {
    switch (option) {
        case "buy" :
            $('.text-message').html('Выберите площадку');
            $('.change-serv').show();
            break;
        case "auto-buy" :
            $('.text-message').html('Выберите площадку');
            $('.change-serv').show();
            $('.change-serv #waxpeer').hide();
            break;
    }
}

function changeService (servType, mode) {
    switch (servType) {
        case "dmarket" :
            if (mode == "buy") {
                $('.text-message').html('Выберите способ пополнения');
                $('.change-deposit').show();
            } else {
                $('.input-price').show();
                $('.text-message').html('Введите цены');
                $('.price-serv').before('Цена в стиме');
                $('.price-any').hide();
            }
            $('.calc').attr('data-service-type', servType);
            break;
        case "steam" :
            $('.input-price').show();
            if (mode == "buy") {
                $('.text-message').html('Введите цены');
                $('.price-serv').before('Цена покупки');
                $('.price-any').before('Цена продажи');
            } else {
                $('.text-message').html('Введите цены');
                $('.price-serv').before('Цена в стиме');
                $('.price-any').hide();
            }
            $('.calc').attr('data-service-type', servType);
            break;
        case "dm-csanal" :
            $('.input-price').show();
            if (mode == "buy") {
                $('.text-message').html('Введите цены');
                $('.price-serv').before('Цена покупки');
                $('.price-any').before('Цена продажи');
            } else {
                $('.text-message').html('Введите цены');
                $('.price-serv').before('Цена в analyst');
                $('.price-any').hide();
            }
            $('.calc').attr('data-service-type', servType);
            break;
        case "waxpeer" :

            break;
    }
}

function resultOutput (result, profitPerc) {
    $('.text-message').html(result);

    if (profitPerc > 60) {
        $('.text-message').append(' Очень выгодно');
    }
    if (profitPerc > 45 && profitPerc < 60) {
        $('.text-message').append(' Хорошая выгода');
    }
    if (profitPerc > 30 && profitPerc < 40) {
        $('.text-message').append(' Минимальная выгода');
    }
    if (profitPerc < 30) {
        $('.text-message').append(' Выгоды нет!');
    }
}

function dmarket(depType, firstPrice, secondPrice, mode) {
    var firstPriceUSD, firstPriceEUR, profitArr = new Array();
    switch (mode) {
        case "buy" :
            firstPriceUSD = firstPrice * usd;
            firstPriceEUR = firstPrice * eur;
            if ( depType == 'visa' ) {
                firstPriceUSD = firstPriceUSD / 0.975 + usd * 0.33;   
                firstPriceEUR = firstPriceEUR / 0.975 + eur * 0.33;
            }
            if ( depType == 'bitcoin' ) {
                firstPriceUSD = firstPriceUSD / 0.99 + usd * 0.06;   
                firstPriceEUR = firstPriceEUR / 0.99 + eur * 0.06;
            }
            secondPrice = secondPrice * 0.85;
            profitRUB = secondPrice;
            profitPerc = (secondPrice / firstPriceUSD - 1) * 100;
            secondPrice = secondPrice - firstPriceUSD;
            profitUSD = secondPrice / usd;
            resultOutput("Профит " + Math.round(profitPerc) + "% Профит " + Math.round(secondPrice) + "Руб. Профит $" + Math.round(profitUSD) + " Заплатили " + Math.round(firstPriceUSD) + "Руб. Получили в Steam " + Math.round(profitRUB) + "Руб.", profitPerc);
            break;
        case "auto-buy" :
            firstPrice = firstPrice / usd;
            firstPrice = firstPrice * 0.85;
            secondPrice = firstPrice / 1.3;
            console.log(profitArr);
            profitArr.push('Профит 30% ' + Math.round(secondPrice));
            secondPrice = firstPrice / 1.5;
            profitArr.push('Профит 50% ' + Math.round(secondPrice));
            secondPrice = firstPrice / 1.7;
            profitArr.push('Профит 70% ' + Math.round(secondPrice));
            resultOutput(profitArr);
            break;
    }

}

function steam (firstPrice, secondPrice, mode) {
    var profitArr = new Array();;
    switch (mode) {
        case "buy" :
            secondPrice = secondPrice * 0.85;
            profitPerc = (secondPrice / firstPrice - 1) * 100;
            secondPrice = secondPrice - firstPrice;
            resultOutput("Профит " + Math.round(profitPerc) + "% Профит " + Math.round(secondPrice) + "Руб");
            break;
        case "auto-buy" :
            firstPrice = firstPrice * 0.85;
            secondPrice = firstPrice / 1.3;
            profitArr.push('Профит 30% ' + Math.round(secondPrice));
            secondPrice = firstPrice / 1.5;
            profitArr.push('Профит 50% ' + Math.round(secondPrice));
            secondPrice = firstPrice / 1.7;
            profitArr.push('Профит 70% ' + Math.round(secondPrice));
            resultOutput(profitArr);
            break;
    }

}

function dmarkCSanal (firstPrice, secondPrice, mode) {
    var profitArr = new Array();
    switch (mode) {
        case "buy" :
            secondPrice = secondPrice * 0.85;
            profitPerc = (secondPrice / firstPrice - 1) * 100;
            resultOutput("Профит " + Math.round(profitPerc) + "%", Math.round(profitPerc));
            break;
        case "auto-buy" :
            firstPrice = firstPrice * 0.85;
            secondPrice = firstPrice / 1.3;
            profitArr.push('Профит 30% ' + Math.round(secondPrice));
            secondPrice = firstPrice / 1.5;
            profitArr.push('Профит 50% ' + Math.round(secondPrice));
            secondPrice = firstPrice / 1.7;
            profitArr.push('Профит 70% ' + Math.round(secondPrice));
            resultOutput(profitArr);
            break;
    }


}
