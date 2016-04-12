
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetValue = $('#street').val();
    var cityValue = $('#city').val();

    var address = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location="+streetValue+", "+cityValue + " ";

    $(greeting).text("so, you want to live at "+streetValue+", "+cityValue);

    $body.append('<img class ="bgimg" src="' + address + '">');

    //Load NY times articles 

    var nytimeURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q='
    +cityValue+'&sort=newest&api-key=059a17ee3656630bdfe61e4a7fc17e0e:11:74959180';

    $.getJSON(nytimeURL, function(data){
        $nytHeaderElem.text("New York times article about "+cityValue);

        articles = data.response.docs;
        for(var i=0; i<articles.length; i++)
        {
                var article = articles[i];
                $nytElem.append('<li class= "article">' + '<a href ="' + article.web_url+'">' 
                    + article.headline.main + '</a>' +
                    '<p> '+article.snippet+ '</p>' + '</li>'
                    );
        }
    }).error(function(e){
        $nytHeaderElem.text("New York Times article Fail to load") ;
    })

    //Load Wikipedia Articles

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityValue
    + '&format=json&callback=wikiCallback';

    var wikiTimeout = setTimeout(function(){
        $wikiElem.text("Failed to load wikipedia resources")} , 8000 );

    $.ajax({
        url: wikiUrl,
        dataType:"jsonp",
        success: function (response) {
            var articleList = response[1];

            for(var i=0; i<articleList.length;i++) {
                articleStr = articleList[i];
                var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="'+url+'">' +articleStr+ '</a></li>');
            };
            clearTimeout(wikiTimeout);
        }

    });

    return false;
};

$('#form-container').submit(loadData);
