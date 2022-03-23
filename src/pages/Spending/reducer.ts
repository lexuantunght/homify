import DispatchType from '../../common/constants/DispatchType';

const defaultSpendingStates = {
    page: 0,
    limit: 10,
    queryData: {
        name: '',
        spendingType: '',
        spendingMethod: '',
        fromDate: '',
        toDate: '',
    },
};

const spendingReducer = (state = defaultSpendingStates, action: any) => {
    switch (action.type) {
        case DispatchType.SPENDING.PAGE:
            return { ...state, page: action.data };
        case DispatchType.SPENDING.LIMIT:
            return { ...state, limit: action.data };
        case DispatchType.SPENDING.QUERY:
            return {
                ...state,
                queryData: action.data,
            };
        default:
            return state;
    }
};

export default spendingReducer;
