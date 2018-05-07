const moment = require('moment');

/**
 *
 * @param {String} from
 * @param {String} text
 */
var generateMessage = ((from, text) =>
{

    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
});

module.exports = {generateMessage};