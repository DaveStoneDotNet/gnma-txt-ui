import * as types from './actionTypes'

export function success(opts) {
    return show(opts, 'success')
}

// Most simple invocation with a message and a level of success, error, warning, or default.

export function message(message, level = 'default') {

    const options = { message: message }

    return show(options, level)
}

// Show the notification with default options.

export function show(opts = {}, level = 'success') {
    return {
                type:             types.ADD_NOTIFICATION,
                uid:              opts.uid || Date.now(),
                level:            level, 
                position:         'tr',
                secondsToDismiss: 10, 

                ...opts,
             }
  }

export function hide(uid) {
      return {
                type: types.REMOVE_NOTIFICATION,
                uid
             }
  }

