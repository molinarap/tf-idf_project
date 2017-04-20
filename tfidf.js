// La funzione di peso tf-idf (term frequency–inverse document frequency)
// è una funzione utilizzata in information retrieval per misurare l'importanza di un termine
// rispetto ad un documento o ad una collezione di documenti.
// Tale funzione aumenta proporzionalmente al numero di volte che il termine è contenuto nel documento,
// ma cresce in maniera inversamente proporzionale con la frequenza del termine nella collezione.
// L'idea alla base di questo comportamento è di dare più importanza ai termini che compaiono nel documento,
// ma che in generale sono poco frequenti.

const natural = require('natural');
const Promise = require('bluebird');

var initText = "Il cane è molto bello. la bambina gioca a pallone con il cane, il cane è nero e blu e nero";

var readText = function(text) {
    return new Promise(function(resolve, reject) {
        var tokenizer = new natural.RegexpTokenizer({ pattern: /\s/ });
        var t = tokenizer.tokenize(text);
        resolve(t);
    });
};

var findTerm = function(text) {
    return new Promise(function(resolve, reject) {
        var tfidf = new natural.TfIdf();
        tfidf.addDocument(text);
        // tfidf.addFileSync('test.properties');
        var tf = tfidf.documents[0];
        delete tf["__key"];
        var finalTfidf = []
        tfidf.listTerms(0).forEach(function(item) {
            item.tf = tf[item.term];
            finalTfidf.push(item)
        });
        resolve(finalTfidf);
    });
};

var regexStopWords = function(k) {
    var regex = /^(il|lo|la|i|gli|le|un|un|uno|una|di|a|da|in|con|su|per|tra|fra|del|dello|della|dei|degli|delle|dallo|dalla|dai|dagli|dalle|al|allo|alla|ai|agli|alle|nel|nello|nella|nei|negli|nelle|col|collo|colla|coi|cogli|colle|sul|sullo|sulla|sui|sugli|sulle|pel|pello|pella|pei|pegli|io|tu|egli|lui|esso|lei|ella|essa|noi|voi|essi|esse|me|te|lui|lei|noi|voi|loro|mi|ti|lo|gli|la|ci|vi|li|ne|le|si|mio|mia|miei|mie|tuo|tua|tuoi|tue|suo|sua|suoi|sue|nostro|nostra|nostri|nostre|vostro|vostra|vostri|vostre|loro|proprio|e|anche|pure|né|neppure|ma|però|anzi|tuttavia|piuttosto|nondimeno|o|ovvero|oppure|altrimenti|ossia|infatti|invero|cioè|quindi|ebbene|eppure|perciò|perché|affinché|che|purché|qualora|poiché|siccome|seppure|sebbene|benché|cosicché|mentre|finchè|quando|prima|come|dopo|se|quando|laddove|quanto|senza|eccetto)$/i;
    if (regex.test(k)) {
        return true;
    } else {
        return false;
    }
};

var removeStopWords = function(elem) {
    if (regexStopWords(elem.term)) {
        elem.stopWord = true;
    } else {
        elem.stopWord = false;
    }
    return elem;
};

findTerm(initText)
    .map(word => removeStopWords(word), { concurrency: 10 })
    .then(function(res2) {
        console.log("res2 ------->", res2);
    })
    .catch(function(e) {
        console.error('ERROR PROMISE --->' + e);
    });
