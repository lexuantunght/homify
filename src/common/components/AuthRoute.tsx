import React from 'react';
import { Route, Redirect } from 'react-router-dom';

type PrivateRouteProps = {
    children: React.ReactNode;
    isAuthenticated?: boolean;
    path: string;
    exact?: boolean;
};

const AuthRoute: React.FC<PrivateRouteProps> = ({
    children,
    isAuthenticated,
    path,
    exact = true,
}) => {
    return (
        <Route
            path={path}
            exact={exact}
            render={({ location }) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export default React.memo(AuthRoute);
