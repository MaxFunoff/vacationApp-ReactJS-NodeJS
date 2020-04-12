const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA': {
            return {
                ...state,

                vacation: { ...action.payload },
                error: false
            };
        }
        case 'SET_ERROR': {
            return {
                ...state,

                vacation: [],
                error: true
            };
        }
        case 'SET_FIELD': {
            return {
                ...state,
                vacation: {
                    ...state.vacation,
                    [action.fieldName]: action.payload,
                }
            };
        }
        default:
            return state;
    }
}

export default Reducer;