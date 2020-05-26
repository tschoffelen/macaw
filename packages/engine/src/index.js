const Macaw = require("./lib/Macaw");

/**
 * Macaw class factory. This is what you will use to initiate your personal
 * Macaw instance.
 *
 * @example const mailer = macaw({ templatesDirectory: 'emails' });
 *
 * @param {object} options Options to pass to Macaw class, see below
 * @returns {Macaw}
 */
const macaw = options => new Macaw(options);

module.exports = macaw;
