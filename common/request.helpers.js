import { isHealthUrl, isResourceUrl } from './url-string.helpers'

function validHapiRequest (hapiRequestUrl) {
    if (!hapiRequestUrl) {
        throw new Error('Hapi request url is required')
    }

    if (!hapiRequestUrl.hasOwnProperty('pathname')) {
        throw new Error('Hapi request url requires a \'pathname\' property')
    }

    return { url: hapiRequestUrl.pathname }
}

function isHealthCheckRequest (hapiRequest) {
    const { url } = validHapiRequest(hapiRequest)
    return isHealthUrl(url)
}

function isResourceRequest (hapiRequest) {
    const { url } = validHapiRequest(hapiRequest)
    return isResourceUrl(url)
}

function extractUrl (hapiRequest) {
    return `${hapiRequest.server.info.uri}/${hapiRequest.path}`
}

export {
    isHealthCheckRequest,
    isResourceRequest,
    extractUrl
}
