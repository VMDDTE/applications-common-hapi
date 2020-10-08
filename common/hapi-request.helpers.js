import { isHealthUrl, isResourceUrl } from './url-string.helpers'

function validateHapiRequest (hapiRequest) {
    if (!hapiRequest) {
        throw new Error('Hapi request is required')
    }

    if (!hapiRequest.url) {
        throw new Error('Hapi request url is required')
    }

    if (!hapiRequest.url.pathname) {
        throw new Error('Hapi request url requires a \'pathname\' property')
    }

    return { url: hapiRequest.url.pathname }
}

function isHealthCheckRequest (hapiRequest) {
    const { url } = validateHapiRequest(hapiRequest)
    return isHealthUrl(url)
}

function isResourceRequest (hapiRequest) {
    const { url } = validateHapiRequest(hapiRequest)
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
