import { isHealthUrl, isResourceUrl } from './url-string.helpers'

function validateHapiRequest (hapiRequest) {
    if (!hapiRequest) {
        throw new Error('Hapi request is required')
    }

    if (!hapiRequest.info) {
        throw new Error('Hapi request info is required')
    }

    if (!hapiRequest.info.id) {
        throw new Error('Hapi request info requires a \'id\' property')
    }

    if (!hapiRequest.method) {
        throw new Error('Hapi request method is required')
    }

    if (!hapiRequest.url) {
        throw new Error('Hapi request url is required')
    }

    if (!hapiRequest.url.pathname) {
        throw new Error('Hapi request url requires a \'pathname\' property')
    }

    return {
        correlationId: hapiRequest.info.id,
        httpMethod: hapiRequest.method,
        url: hapiRequest.url.pathname
    }
}

export function isHealthCheckRequest (hapiRequest) {
    const { url } = validateHapiRequest(hapiRequest)
    return isHealthUrl(url)
}

export function isResourceRequest (hapiRequest) {
    const { url } = validateHapiRequest(hapiRequest)
    return isResourceUrl(url)
}

export function extractLogMessageInfoFromHapiRequest (hapiRequest) {
    const { correlationId, httpMethod, url } = validateHapiRequest(hapiRequest)

    return {
        correlationId,
        httpMethod,
        url
    }
}
