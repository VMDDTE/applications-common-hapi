import { isHealthUrl } from './url-helpers'

function isHealthCheckRequest (hapiRequest) {
    return isHealthUrl(hapiRequest.path)
}

function extractUrl (hapiRequest) {
    return `${hapiRequest.connection.info.protocol}://${hapiRequest.info.host}/${hapiRequest.path}`
}

export {
    isHealthCheckRequest,
    extractUrl
}
