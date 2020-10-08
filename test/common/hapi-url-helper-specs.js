/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
import { describe, it } from 'mocha'
import chai from 'chai'
import { expectThrows } from '../helpers'
import { isHealthUrl, isResourceUrl } from '../../common/hapi-url.helpers'

const expect = chai.expect

describe('Hapi-Url.Helpers', function () {
    describe('#isHealthUrl', function () {
        // it('should throw error when no hapi request url is provided', async function () {
        //     await expectThrows(() => isHealthUrl(), 'Hapi request url is required')
        // })

        // it('should throw error when no hapi request url pathname property is present', async function () {
        //     await expectThrows(() => isHealthUrl({}), 'Hapi request url requires a \'pathname\' property')
        // })

        it('should return true for health', async function () {
            const result = isHealthUrl('vmd.test.co.uk/health/')
            expect(result).to.be.true
        })

        it('should return false for health without slash', async function () {
            const result = isHealthUrl('vmd.test.co.uk/health')
            expect(result).to.be.false
        })

        it('should return false for none health', async function () {
            const result = isHealthUrl('vmd.test.co.uk/healthy/')
            expect(result).to.be.false
        })
    })

    describe('#isResourceUrl', function () {
        it('should throw error when no hapi request url is provided', async function () {
            await expectThrows(() => isResourceUrl(), 'Hapi request url is required')
        })

        it('should throw error when no hapi request url pathname property is present', async function () {
            await expectThrows(() => isResourceUrl({}), 'Hapi request url requires a \'pathname\' property')
        })

        it('should return true for assets', async function () {
            const result = isResourceUrl({ pathname: 'vmd.test.co.uk/assets/' })
            expect(result).to.be.true
        })

        it('should return true for ASSETS', async function () {
            const result = isResourceUrl({ pathname: 'vmd.test.co.uk/ASSETS/' })
            expect(result).to.be.true
        })

        it('should return true for static', async function () {
            const result = isResourceUrl({ pathname: 'vmd.test.co.uk/static/' })
            expect(result).to.be.true
        })

        it('should return true for STATIC', async function () {
            const result = isResourceUrl({ pathname: 'vmd.test.co.uk/STATIC/' })
            expect(result).to.be.true
        })

        it('should return false for none asset or static', async function () {
            const result = isResourceUrl({ pathname: 'vmd.test.co.uk/nonestatic/' })
            expect(result).to.be.false
        })
    })
})
