const express = require('express');

const router = express.Router();

const agentController = require('../controllers/agent-controller');

router.get('/agent/list', agentController.listAgent);
router.get('/agent/create', agentController.createAgent);

module.exports = router;