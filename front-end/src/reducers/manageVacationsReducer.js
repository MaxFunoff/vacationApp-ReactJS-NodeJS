const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA': {
            return {
                ...state,

                vacations: action.payload,
                error: false
            };
        }
        case 'SET_ERROR': {
            return {
                ...state,

                vacations: [],
                error: true
            };
        }
        default:
            return state;
    }
}

export default Reducer;