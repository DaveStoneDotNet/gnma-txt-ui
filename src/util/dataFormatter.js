import moment from 'moment'

export function formatShortApiDate(apiDate, option) {
    option = option ? option : ''
    return apiDate ? `${moment(apiDate).format('ddd MM-DD-YYYY')}` : option
}

export function formatApiTime(apiDate, option) {
    option = option ? option : ''
    return apiDate ? `${moment(apiDate).format('hh:mm:ss A')}` : option
}

export function formatLongApiDateTime(apiDate, option) {
    option = option ? option : ''
    return apiDate ? `${moment(apiDate).format('ddd MM-DD-YYYY hh:mm:ss A')}` : option
}

export function formatNumber(number, decimals) {
    decimals = decimals ? decimals : 0
    return `${number.toLocaleString(navigator.language, {minimumFractionDigits: decimals})}`
}

export function pluralize(number, text) {
    text = text ? text : ''
    return number === 1 ? `1 ${text}` : `${formatNumber(number)} ${text}s` 
}