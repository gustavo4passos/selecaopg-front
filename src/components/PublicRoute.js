import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'

import { isAuthenticated } from '../services/auth';

export const PublicRoute = ({component: Component, restricted, ...rest}) => {
    return (
        <Route
            {...rest}
            render={props => 
                isAuthenticated() && restricted ? (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: { from: props.location  }
                        }}
                    />
                ) : <Component {...props} />
            }
        />
    );
}