
// The whole state of your app is stored in an object tree inside a single store.
// The only way to change the state tree is to emit an action - an object describing what happened.
// To specify how actions transform the state tree, you write pure reducers.

// The actual 'shape' of the store is better reflected in 'reducers/index.js' which combines all of the defined reducers into a single reducer, 
// and 'reducers/initialState.js' which is an optional, non-redux object, intended to provide default values for each defined state object.
// That is, by defining initial states here, it can be helpful to provide a picture of the full object tree in the store.

export default {
                   app:                 {
                                            appDimensions:        {
                                                                      width:  0,
                                                                      height: 0
                                                                  }, 
                                            appStatus:            {
                                                                      status:  'working',
                                                                      message: ''
                                                                  }, 
                                            errors:               [], 
                                            isAppConnected:       null, 
                                            isConfigInitialized:  { isInitialized: null }, 
                                            isDataInitialized:    { isInitialized: null }, 
                                            isLookupsInitialized: { isInitialized: null }, 
                                            data:                 '',
                                            config:               {},
                                            lookups:              {}, 
                                            saveTextFileResponse: {
                                                                    IsSuccessful: null, 
                                                                    Messages:     []
                                                                  }, 
                                            textFiles:            [], 
                                            gnmaTextFile:         [], 
                                            poolRecordLayouts:    {}, 
                                            gnmaTextFileName:     '', 
                                            fileShareLocation:    {}
                                        }, 

                   apiStatus:           {
                                            count:                0, 
                                            messages:             []
                                        }, 

                   notifications:       []
               }

               