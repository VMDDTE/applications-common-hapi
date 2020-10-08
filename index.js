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
import { logRequestInfo, logStandardError } from './common/logging-helpers'
import { isHealthCheckRequest, isResourceRequest } from './common/request-helpers'
import { isHealthUrl, isResourceUrl } from './common/hapi-url.helpers'
import { HapiLogger } from './logging/hapi.logger'

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

    logRequestInfo, logStandardError,

    isHealthCheckRequest, isResourceRequest,

    HapiLogger
}
