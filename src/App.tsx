import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';
import { RootState } from './utils/redux/store';
import { useFetchCurrent } from './controllers/AdminController';
import { Toast } from 'primereact/toast';
import AuthRoute from './common/components/AuthRoute';
import DispatchType from './common/constants/DispatchType';
import LoadingMask from './common/components/LoadingMask';
import HeaderBar from './common/components/HeaderBar';
import DashboardPage from './pages/Dashboard';
import LoginPage from './pages/Login';
import ConfigurationPage from './pages/Configuration';
import SpendingPage from './pages/Spending';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            retry: false,
        },
    },
});

const AppContent = () => {
    const dispatch = useDispatch();
    const toast = React.useRef<any>(null);
    const { data, isLoading } = useFetchCurrent();
    const isError = useSelector((state: RootState) => state.app.isError);
    const userData = useSelector((state: RootState) => state.app.userData);

    const onCloseMsg = () => {
        dispatch({ type: DispatchType.APP.ERROR, data: false });
    };

    React.useEffect(() => {
        if (isError) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: isError,
                life: 3000,
            });
        }
    }, [isError]);

    React.useEffect(() => {
        if (data) {
            dispatch({ type: DispatchType.APP.USER_DATA, data });
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return <LoadingMask />;
    }

    return (
        <React.Fragment>
            <HeaderBar />
            <div className="flex flex-1">
                <Switch>
                    <Route path="/login" exact>
                        <LoginPage />
                    </Route>
                    <AuthRoute
                        path="/spending"
                        isAuthenticated={userData || data}
                    >
                        <SpendingPage />
                    </AuthRoute>
                    <AuthRoute
                        path="/configuration"
                        isAuthenticated={userData || data}
                    >
                        <ConfigurationPage />
                    </AuthRoute>
                    <Route path="/home">
                        <Redirect to="/" />
                    </Route>
                    <AuthRoute path="/" isAuthenticated={userData || data}>
                        <DashboardPage />
                    </AuthRoute>
                </Switch>
            </div>
            <Toast ref={toast} onHide={onCloseMsg} position="top-center" />
        </React.Fragment>
    );
};

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div className="app-content p-3">
                    <AppContent />
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
