// 0-999 Common audit codes
// 10,000 - 99,999 Foundations audit codes
// So we will use 100,000 - 199,000 for applcations audit codes
// CRM: 100,000 - 100,999
// Licensing: 101000 - 101999
const AuditCodeEnum = {
    LICENSING_SUBMISSION_FAILURE: 101000
}

const PmcCodeEnum = {
    BUSINESS_TRANSACTIONS: 'PMC-07-06-AB'
}

const PriorityEnum = {
    NORMAL: 'Normal',
    UNEXPECTED: 'Unexpected',
    EXCEPTION: 'Exception'
}

module.exports = {
    AuditCodeEnum,
    PmcCodeEnum,
    PriorityEnum
}
