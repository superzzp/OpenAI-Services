const express = require('express')
const needle = require('needle')
const router = express.Router()

// Env vars
const OPAI_BASE_URL = process.env.OPAI_BASE_URL
const OPAI_CREDENTIALS = process.env.OPAI_CREDENTIALS

router.post('/', async (req, res) => {
    try {
        const body = req.body;
        if (body.prompt == undefined) {
            res.status(401).json('request missing prompt')
        } else if (body.max_tokens == undefined) {
            res.status(402).json('request missing max_tokens')
        } else if (body.max_tokens != undefined && body.max_tokens > 512) {
            res.status(403).json('Can\'t submit a request for more than 512 words response')
        } else if (body.model == undefined) {
            res.status(405).json('request missing data model')
        } else {
            const url = OPAI_BASE_URL + body.model + '/completions';
            const apiBody = {
                "prompt": body.prompt,
                "max_tokens": body.max_tokens,
                "temperature": body.temperature,
                "top_p": body.top_p,
                "frequency_penalty": body.frequency_penalty,
                "presence_penalty": body.presence_penalty,
            }
            var options = {
                headers: { 'Content-Type': 'application/json',
                'Authorization': OPAI_CREDENTIALS }
            }
            const apiRes = await needle('post', url, apiBody, options)
            const apiResText = apiRes.body.choices[0].text;
            res.status(200).json({"text": apiResText})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

module.exports = router


