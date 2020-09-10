import { isHealthUrl } from './url-helpers'

function isHealthCheckRequest (hapiRequest) {
    return isHealthUrl(hapiRequest.path)
}

function extractUrl (hapiRequest) {
    return `${hapiRequest.info.uri}/${hapiRequest.path}`
}

export {
    isHealthCheckRequest,
    extractUrl
}
