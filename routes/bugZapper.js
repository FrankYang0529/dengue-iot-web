const CONFIG = require('config');
const bugZapper = require(CONFIG.Controllers('bugZapper'));
let router = require('koa-router')();

router.post('/', bugZapper.addCapture);
router.get('/', bugZapper.getCapture);

module.exports = router;
