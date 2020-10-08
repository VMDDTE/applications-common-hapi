import { isHealthUrl, isResourceUrl } from './hapi-url.helpers'

function isHealthCheckRequest (hapiRequest) {
    return isHealthUrl(hapiRequest.path)
}

function isResourceRequest (hapiRequest) {
    return isResourceUrl(hapiRequest.url)
}
function extractUrl (hapiRequest) {
    return `${hapiRequest.server.info.uri}/${hapiRequest.path}`
}

export {
    isHealthCheckRequest,
    isResourceRequest,
    extractUrl
}
