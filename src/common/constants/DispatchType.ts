enum AppDispatch {
    'USER_DATA' = 'SET_APP_USER_DATA',
    'ERROR' = 'SET_APP_ERROR',
}

enum SpendingDispatch {
    'PAGE' = 'SET_SPENDING_PAGE',
    'LIMIT' = 'SET_SPENDING_LIMIT',
    'QUERY' = 'SET_SPENDING_QUERY',
}

const DispatchType = {
    APP: AppDispatch,
    SPENDING: SpendingDispatch,
};

export default DispatchType;
