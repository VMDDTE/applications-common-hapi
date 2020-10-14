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

    if (!hapiRequest.server.info.uri) {
        throw new Error('Hapi request server info uri is required')
    }

    if (!hapiRequest.path) {
        // hapiRequest.path hapiRequest.url.pathname always appeared to be the same
        throw new Error('Hapi request path is required')
    }

    return {
        correlationId: hapiRequest.info.id,
        httpMethod: hapiRequest.method,
        url: `${hapiRequest.server.info.uri}${hapiRequest.path}`
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
