/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
import { describe, it } from 'mocha'
import chai from 'chai'
import { expectThrows } from '../helpers'
import { isHealthCheckRequest, isResourceRequest } from '../../common/hapi-request.helpers'

const expect = chai.expect

function buildHapiRequest (path, method = 'GET') {
    return {
        info: { id: '123' },
        path,
        // url: { pathname: path },
        method,
        server: { info: { uri: path } }
    }
}

describe('Hapi-Request.Helper', function () {
    describe('#isHealthCheckRequest', function () {
        it('should throw error when no hapi request is provided', async function () {
            await expectThrows(() => isHealthCheckRequest(), 'Hapi request is required')
        })

        it('should throw error when no hapi request info is provided', async function () {
            await expectThrows(() => isHealthCheckRequest({ }), 'Hapi request info is required')
        })

        it('should throw error when no hapi request info id is provided', async function () {
            await expectThrows(() => isHealthCheckRequest({ info: {} }), 'Hapi request info requires a \'id\' property')
        })

        it('should throw error when no hapi request method is provided', async function () {
            await expectThrows(() => isHealthCheckRequest({ info: { id: '123' } }), 'Hapi request method is required')
        })

        it('should throw error when no hapi request server is provided', async function () {
            await expectThrows(() => isHealthCheckRequest({ info: { id: '123' }, method: 'GET' }), 'Hapi request server is required')
        })

        it('should throw error when no hapi request server info is provided', async function () {
            await expectThrows(() => isHealthCheckRequest({ info: { id: '123' }, method: 'GET', server: {} }), 'Hapi request server info is required')
        })

        it('should throw error when no hapi request server info uri is provided', async function () {
            await expectThrows(() => isHealthCheckRequest({ info: { id: '123' }, method: 'GET', server: { info: {} } }), 'Hapi request server info uri is required')
        })

        it('should throw error when no hapi request path is provided', async function () {
            await expectThrows(() => isHealthCheckRequest({ info: { id: '123' }, method: 'GET', server: { info: { uri: '/test' } } }), 'Hapi request path is required')
        })

        it('should return true for health', async function () {
            const result = isHealthCheckRequest(buildHapiRequest('vmd.test.co.uk/health/'))
            expect(result).to.be.true
        })

        it('should return false for health without slash', async function () {
            const result = isHealthCheckRequest(buildHapiRequest('vmd.test.co.uk/health'))
            expect(result).to.be.false
        })

        it('should return false for none health', async function () {
            const result = isHealthCheckRequest(buildHapiRequest('vmd.test.co.uk/healthy/'))
            expect(result).to.be.false
        })
    })

    describe('#isResourceRequest', function () {
        it('should throw error when no hapi request is provided', async function () {
            await expectThrows(() => isResourceRequest(), 'Hapi request is required')
        })

        it('should throw error when no hapi request info is provided', async function () {
            await expectThrows(() => isResourceRequest({ }), 'Hapi request info is required')
        })

        it('should throw error when no hapi request info id is provided', async function () {
            await expectThrows(() => isResourceRequest({ info: {} }), 'Hapi request info requires a \'id\' property')
        })

        it('should throw error when no hapi request method is provided', async function () {
            await expectThrows(() => isResourceRequest({ info: { id: '123' } }), 'Hapi request method is required')
        })

        it('should throw error when no hapi request server is provided', async function () {
            await expectThrows(() => isResourceRequest({ info: { id: '123' }, method: 'GET' }), 'Hapi request server is required')
        })

        it('should throw error when no hapi request server info is provided', async function () {
            await expectThrows(() => isResourceRequest({ info: { id: '123' }, method: 'GET', server: {} }), 'Hapi request server info is required')
        })

        it('should throw error when no hapi request server info uri is provided', async function () {
            await expectThrows(() => isResourceRequest({ info: { id: '123' }, method: 'GET', server: { info: {} } }), 'Hapi request server info uri is required')
        })

        it('should throw error when no hapi request path is provided', async function () {
            await expectThrows(() => isHealthCheckRequest({ info: { id: '123' }, method: 'GET', server: { info: { uri: '/test' } } }), 'Hapi request path is required')
        })

        it('should return true for assets', async function () {
            const result = isResourceRequest(buildHapiRequest('vmd.test.co.uk/assets/'))
            expect(result).to.be.true
        })

        it('should return true for ASSETS', async function () {
            const result = isResourceRequest(buildHapiRequest('vmd.test.co.uk/ASSETS/'))
            expect(result).to.be.true
        })

        it('should return true for static', async function () {
            const result = isResourceRequest(buildHapiRequest('vmd.test.co.uk/static/'))
            expect(result).to.be.true
        })

        it('should return true for STATIC', async function () {
            const result = isResourceRequest(buildHapiRequest('vmd.test.co.uk/STATIC/'))
            expect(result).to.be.true
        })

        it('should return false for none asset or static', async function () {
            const result = isResourceRequest(buildHapiRequest('vmd.test.co.uk/nonestatic/'))
            expect(result).to.be.false
        })
    })

    // Test required for extract url
})
