// Note: done this way otherwise errors are seen in consuming application
const ApiService = require('./api-services/api.service')
const FoundationsApiService = require('./api-services/foundations-api.service')

module.exports = {
    ApiService,
    FoundationsApiService
}
