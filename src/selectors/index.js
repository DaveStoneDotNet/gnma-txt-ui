import { createSelector } from 'reselect'
 
// Calculates property values based on changing state values. i.e. Calculates values derived from potentially changing values in state.
// Selectors are efficient because a selector is not re-computed unless one of its arguments change.

// The following defines values to obtain from state...

const getConfig  = (state) => state.app.isConfigInitialized
const getData    = (state) => state.app.isDataInitialized
const getLookups = (state) => state.app.isLookupsInitialized

// The selector below can then return new values calculated off of the 'watched' selectors defined above.
// It accepts an array of 'selectors' as the first parameter - the methods defined above to 'select' a property value from state.
// The second parameter is the method used to calculate the return value based on some logic derived from the selectors.

// In this example, the intent is to return TRUE only when ALL of the properties are TRUE. This is intended to indicate that all 
// the tasks necessary to run the site have been loaded an initialized. e.g. All the necessary Lookups and Configurations for the site have been loaded.

export const isInitializedSelector = createSelector([getConfig, getData, getLookups], (isConfigInitialized, isDataInitialized, isLookupsInitialized) => { 
    return isConfigInitialized.isInitialized && isDataInitialized.isInitialized && isLookupsInitialized.isInitialized
} )

// The selector below is intended to indicate connectivity. If an api is down, or perhaps the api has a misconfigured url, this means the site isn't connected, 
// as opposed to being connected but getting some remote 500 server api error passed down to the site. Or perhaps you can connect to the api but you've called 
// the wrong method and you get a 404 error. This has been quite a challenge because it's not enough to know that an api call failed - you have to know WHY the 
// api called failed - e.g. the 'Reason' - which is currently denoted by:
//
//      - 0 - Successful
//      - 1 - Not Connected
//      - 2 - Failed
// 
// The challenge then is to determine how to manage those reasons. For example, showing disconnected if ANY of the api calls fail for a specific disconnected reason. 

export const isConnectedSelector = createSelector([getConfig, getData, getLookups], (isConfigInitialized, isDataInitialized, isLookupsInitialized) => { 

    let isConnected = null
    
    if (isConfigInitialized.reason != null && isDataInitialized.reason != null && isLookupsInitialized.reason != null) {
        
        if ((isConfigInitialized.reason + isDataInitialized.reason + isLookupsInitialized.reason) === 0) {
            isConnected = true
        } else {
            const isConfigConnected  = isConfigInitialized.reason  === 0 || isConfigInitialized.reason  === 2
            const isDataConnected    = isDataInitialized.reason    === 0 || isDataInitialized.reason    === 2
            const isLookupsConnected = isLookupsInitialized.reason === 0 || isLookupsInitialized.reason === 2
    
            isConnected = isConfigConnected || isDataConnected || isLookupsConnected
        }

    }

    return isConnected
} )
