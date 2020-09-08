import { isHealthUrl } from '../common/helpers'

function isHealthCheckRequest (request) {
    return isHealthUrl(request.path)
}

export {
    isHealthCheckRequest
}
