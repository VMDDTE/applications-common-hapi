import { isHealthUrl } from './url-helpers'

function isHealthCheckRequest (request) {
    return isHealthUrl(request.path)
}

export {
    isHealthCheckRequest
}
