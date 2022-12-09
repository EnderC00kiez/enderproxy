// rewrite pages so their reletave links work
// we have to append /proxy/{currentsite} to the start of the reletave links


const reletave = new RegExp('^\\/([a-z\\d%_.~+]+\\/)*([a-z\\d%_.~+]+)?(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');
// this file is injected into all proxied pages
// it rewrites all links so they work
window.onload = function() {
    // get all urls
    // not just links, but also images, scripts, etc.
    // we can regex check
    // regex is stored in reletave
    // simply replace all regex matches with /proxy/{currentsite}/{match}
    // get document html
    var html = document.documentElement.innerHTML;
    // get all matches
    html.replace(reletave, function(match) {
        // replace all matches with /proxy/{currentsite}/{match}
        html = html.replace(match, '/proxy/' + window.location.host + match);
    });

}
