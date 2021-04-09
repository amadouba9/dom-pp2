// //this method will return all descendant of json structure
// function extractJSON(obj, descendant = []) {
//     for (const i in obj) {
//         if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
//             if (obj[i].name != undefined) {
//                 descendant.push(obj[i])
//             }
//             descendant = extractJSON(obj[i], descendant);
//         }
//     }
//     return descendant;
// }

// export { extractJSON }

//this method will return all descendant of json structure

function extractJSON(obj, descendant, isFirstIteration) {

    for (const i in obj) {
        if (isFirstIteration === true) {
            descendant.push(obj);
            isFirstIteration = false;
        }
        if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
            if (obj[i].name != undefined) {
                descendant.push(obj[i]);
            }
            descendant = extractJSON(obj[i], descendant, false);
        }
    }
    return descendant;
}

export { extractJSON }