/**
 * Created by dat on 20/09/2016.
 */

/**
 *
 * @param array
 * @returns {Array}
 */
var shuffle = function(array) {
    var copy = [],
        n = array.length,
        i;

    // While there remain elements to shuffle…
    while (n) {

        // Pick a remaining element…
        i = Math
            .floor(Math.random() * array.length);

        // If not already shuffled, move it to the new array.
        if (i in array) {
            copy
                .push(array[i]);
            delete array[i];
            n--;
        }
    }
    return copy;
};
/**
 *
 * @param id
 * @returns {Element}
 * @constructor
 */
var HTMLObject = function (id) {
    return document.getElementById(id);
};
/**
 *
 * @param _class
 * @returns {NodeList}
 * @constructor
 */
var HTMLObjects = function (_class) {
    return document.getElementsByClassName(_class);
};
/**
 *
 * @param HTMLObject
 */
var removeAllChildHTMLObject = function (HTMLObject) {
    while(HTMLObject.firstChild){
        HTMLObject.removeChild(HTMLObject.firstChild);
    }
};
