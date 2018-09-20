const express = require('express');
const router = express.Router();
const CAW = require('curse-api-wrapper');
const config = require('../config');

const curse = new CAW({username: config.curseAPI.username, password: config.curseAPI.password});
curse.Authenticate();

function checkToken(req, res, next) {
    if (config.proxyAuth.enabled) {
        if (config.proxyAuth.tokens.includes(req.get('authToken'))) {
            next()
        } else {
            res.status(401);
            res.send('Unauthorized');
        }
    } else {
        next();
    }
}

router.get('/addon/:id', checkToken, function (req, res, next) {
    // console.log(req.body);
    curse.GetAddon(req.params.id)
        .then(data => {
            res.json(JSON.parse(data))
        })
        .catch(err => {
            res.send(`Error handling request, server responded with: ${err}`)
        });
});

router.post('/addon', checkToken, function (req, res, next) {
    // console.log(req.body);
    curse.GetAddons(req.body)
        .then(data => {
            res.json(JSON.parse(data))
        })
        .catch(err => {
            res.send(`Error handling request, server responded with: ${err}`)
        });
});

/* POST addon(s) fingerprint. */
router.post('/fingerprint', checkToken, function (req, res, next) {
    // console.log(req.body);
    curse.GetFingerprintMatches(req.body)
        .then(data => {
            res.json(JSON.parse(data))
        })
        .catch(err => {
            res.send(`Error handling request, server responded with: ${err}`)
        });
});

module.exports = router;
