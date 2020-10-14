import { auditCodeEnum, pmcCodeEnum, priorityEnum } from './enums/protective-monitoring.enums'
import { authorisationRequestHeaderEnum } from './enums/authorisation-request-headers.enum'
import { permissionEnum } from './enums/permission.enum'
import { roleEnum } from './enums/role.enum'
import { ApiService } from './api-services/api.service'
import { FoundationsApiService } from './api-services/foundations-api.service'
import { ProtectiveMonitoringService } from './services/protective-monitoring.service'
import {
    addMaxContentLengthToRequestConfiguration, addMaxBodyLengthToRequestConfiguration, buildFoundationsApiRequestConfig,
    buildFoundationsApiProtectiveMonitoring,
    buildFoundationsApiResponseOptions,
    returnDataIfSuccessfulOrThrowError, throwUnexpectedResponseCodeError } from './api-services/helpers'
import { buildProtectiveMonitoringOptions } from './services/helpers'
import { isHealthCheckRequest, isResourceRequest } from './common/hapi-request.helpers'
import { isHealthUrl, isResourceUrl } from './common/url-string.helpers'

export {
    auditCodeEnum,
    pmcCodeEnum,
    priorityEnum,
    authorisationRequestHeaderEnum,
    permissionEnum,
    roleEnum,

    ApiService,
    FoundationsApiService,

    addMaxContentLengthToRequestConfiguration,
    addMaxBodyLengthToRequestConfiguration,
    buildFoundationsApiRequestConfig,
    buildFoundationsApiProtectiveMonitoring,
    buildFoundationsApiResponseOptions,
    returnDataIfSuccessfulOrThrowError,
    throwUnexpectedResponseCodeError,

    ProtectiveMonitoringService,
    buildProtectiveMonitoringOptions,

    isHealthCheckRequest, isResourceRequest,

    isHealthUrl, isResourceUrl
}
