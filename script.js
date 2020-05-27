var firstPrice = 0, secondPrice = 0, profitPerc = 0, profitUSD = 0, profitRUB = 0, rate = 0, Solution = 0, money = 0, mode = 0, i = 0, usd, eur;

i = 1;

rate = $.getJSON("https://www.cbr-xml-daily.ru/daily_json.js",
    function (data, textStatus, jqXHR) {
        usd = data.Valute.USD.Value;
        eur = data.Valute.EUR.Value;
        $('.usd').html(data.Valute.USD.Value + " USD");
        $('.eur').html(data.Valute.EUR.Value + " EUR");
    }
);

$('.option-buy').on('click', (e) => {
    e.preventDefault();
    $('.change-options').hide();
    $('.change-area').show();
    $('.text-message').html('Выберите площадку');
});

$('.service-option').on('click', function (e) {
    e.preventDefault();
    $('.change-area').hide();
    var servType = $(this).attr('data-service-type');
    changeService(servType);
});

$('.deposit-option').on( 'click', function (e) { 
    e.preventDefault();
    $('.change-deposit').hide();
    $('.input-price').show();
    $('.price-area').before('Цена на сайте');
    $('.price-any').before('Цена в стиме');
    $('.text-message').html('Введите цены');
    var depType = $(this).attr('data-deposit-type');
    $('.calc').attr('data-deposit-type', depType);
});

$('.calc').on('click', function (e) {
    e.preventDefault();
    firstPrice = $('.price-area').val();
    secondPrice = $('.price-any').val();
    switch ($(this).attr('data-service-type')) {
        case "dmarket" :
            var depType = $(this).attr('data-deposit-type');
            
            if ( depType != undefined ) {
                dmarket(depType, firstPrice, secondPrice);
            }
            break;
        case "steam" :

            break;
        case "dm-csanal" :
            dmarkCSanal(firstPrice, secondPrice);
            break;
        case "waxpeer" :

            break;        
    }



});

function changeService (servType) {
    switch (servType) {
        case "dmarket" :
            $('.change-deposit').show();
            $('.text-message').html('Выберите способ пополнения');
            $('.calc').attr('data-service-type', servType);
            break;
        case "steam" :

            break;
        case "dm-csanal" :
            $('.input-price').show();
            $('.price-area').before('Цена на сайте');
            $('.price-any').before('Цена в аналисте');
            $('.text-message').html('Введите цены');
            $('.calc').attr('data-service-type', servType);
            break;
        case "waxpeer" :

            break;
    }
}

function resultOutput (result) {
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

function dmarket(depType, firstPrice, secondPrice) {
    var firstPriceUSD, firstPriceEUR;
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
    resultOutput("Профит " + Math.round(profitPerc) + "% Профит " + Math.round(secondPrice) + "Руб. Профит $" + Math.round(profitUSD) + " Заплатили " + Math.round(firstPriceUSD) + "Руб. Получили в Steam " + Math.round(profitRUB) + "Руб.")
}


function dmarkCSanal (firstPrice, secondPrice) {
    secondPrice = secondPrice * 0.85;
    profitPerc = (secondPrice / firstPrice - 1) * 100;
    resultOutput("Профит " + profitPerc + "%");

}

function steam (firstPrice, secondPrice) { 
    secondPrice = secondPrice * 0.85;
    profitPerc = (secondPrice / firstPrice - 1) * 100;
    secondPrice = secondPrice - firstPrice;
    resultOutput("Профит " + profitPerc + "% Профит " + secondPrice + "Руб");
}




