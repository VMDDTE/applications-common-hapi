import { FoundationsApiService } from './foundations-api.service'
import { buildAuthorisationHeaders, throwUnexpectedResponseCodeError, buildFoundationsApiRequestConfig } from './helpers'
import fs from 'fs'

export default class FoundationsStorageApiService extends FoundationsApiService {
    constructor (vmdLogger, protectiveMonitoringService) {
        super(vmdLogger, protectiveMonitoringService)

        // Could add the /storage onto the base url as storage will only ever be /storage, however would require k8 changes
        this.baseUrl = process.env.STORAGE_SERVICE_BASE_URL
        this.baseStorageUrl = `${this.baseUrl}/storage`

        this.downloadUrl = `${this.baseStorageUrl}/download`
        this.deleteUrl = `${this.baseStorageUrl}/delete`
    }

    // Currently Hapi applications upload documents by proxying directly to the foundations service, to avoid memory issues with large files

    async download (id, downloadingUserId, originatingRequestId) {
        const url = `${this.downloadUrl}/${id}`
        const headers = buildAuthorisationHeaders(null, downloadingUserId)
        const requestConfiguration = buildFoundationsApiRequestConfig(url, headers, null, originatingRequestId)
        requestConfiguration.responseType = 'stream'

        return await this
            .get(requestConfiguration)
            .then(response => {
                if (response.status !== 200) {
                    throwUnexpectedResponseCodeError(response, '200')
                }

                const writeStream = fs.createWriteStream(`download/${id}`)
                response.data.pipe(writeStream)

                return new Promise((resolve) => {
                    writeStream.on('close', () => {
                        resolve()
                    })
                })
            })
    }

    async delete (id, deletingUserId, originatingRequestId) {
        const url = `${this.deleteUrl}/${id}`
        const headers = buildAuthorisationHeaders(null, deletingUserId)
        const requestConfiguration = buildFoundationsApiRequestConfig(url, headers, null, originatingRequestId)

        return super.delete(requestConfiguration)
    }

    async ping (originatingRequestId) {
        return await this.healthPing(this.baseUrl, originatingRequestId)
    }
}
