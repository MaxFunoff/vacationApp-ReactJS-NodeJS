const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOGGED_IN':
            return {
                ...state,
                userStatus: {
                    isLoggedIn: true,
                    userType: action.payload,
                    userCheckedIn: true,
                },
            };
        case 'SET_LOGGED_OUT':
            return {
                ...state,
                userStatus: {
                    isLoggedIn: false,
                    userType: null,
                    userCheckedIn: true,
                },
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        case 'SET_VACATIONS':
            return {
                ...state,
                vacationsStatus: {
                    data: action.payload,
                    error: null,
                }
            }
        case 'SET_VACATIONS_ERROR':
            return {
                ...state,
                vacationsStatus: {
                    data: [],
                    error: action.payload,
                }
            }
        default:
            return state;
    }
};

export default Reducer;