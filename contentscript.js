var getTheGist = function (src) {  //I Crack Myself UP!
    var deferred = $.Deferred();
    $.ajax({
        url: src + '.js',
        dataType: 'text'
    }).then(function (data) {
        var gist = $(eval('"' + data.substring(data.lastIndexOf("document.write('"), data.lastIndexOf("')")) + '"'));
        namespaceCssClasses(gist);
        $(gist).find('a').addClass('gistpull_nofollow');
        deferred.resolve(gist);
    });
    return deferred.promise()
}

var namespaceCssClasses = function (gist){
    gist.find('*').each(function(){
        if($(this).attr('class')){
            var classes=$(this).attr('class').split(/\s+/);
            for(var i=0; i<classes.length;i=i+1){
                var currentClass = classes[i];
                $(this).removeClass(currentClass).addClass('gistpull_'+currentClass);
            }
        }
    });
}

var partOfEditable = function (link) {
    return $(link).parents('[contenteditable = "true"], :input').length;
}

var gistTest = function (link) { 
    var pat = /https:\/\/gist\.github\.com\/[^\/]+?$/;
    if ($(link).hasClass('gistpull_nofollow')) { return false; }
    var href = $(link).attr('href');
    return pat.test(href) && !partOfEditable(link);
}

var processLink = function (link) { 
    if (gistTest(link)) {
        getTheGist(link).then($.proxy(subGistForLink,link));
    }   
};

var processSummaries = function (summaries) {
    var summary = summaries[0];
    summary.added.forEach(function (link) {
        processLink(link);
    });
}

var subGistForLink = function (gist, b, c, d) {
    $(this).replaceWith(gist);
}

var setupObserver = function(){
    new MutationSummary({
        callback: processSummaries,
        queries: [{
            element: 'a'
        }]
        });
};

$(document).ready(function () {
    $('a').each(function () {
        processLink(this);
    });
    setupObserver();
});


//$(document).load(setupObserver);

//    setTimeout(function () {
//        console.log('here we go');
//        console.log($('a'));
//        var pat = /https:\/\/gist\.github\.com\/[^\/]+?$/;
//        $('a').each(function () {
//            if ($(this).hasClass('gistpull_nofollow')) { return; }
//            var href = $(this).attr('href');
//            console.log(href + ":" + pat.test(href));
//            var that = this;
//            if (pat.test(href)) {
//                getTheGist(href).then(function (data) {
//                    console.log($(that))
//                    $(that).replaceWith($(data));
//                });
//            }
//        });
//    }, 2000);
