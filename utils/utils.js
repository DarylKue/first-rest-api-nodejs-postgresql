
const checkAttributesValues = (obj) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] === null || obj[key] === "" || obj[key] === undefined) {
                return false
            } 
        }
    }
    return true;
}

const checkRequiredAttributes = (obj, required) => {
    const objKeys = Object.keys(obj);
    const includeAll = required.every(element => objKeys.includes(element));
    if(!includeAll) return false;
    return true;
} 


module.exports = {
    checkAttributesValues,
    checkRequiredAttributes
}