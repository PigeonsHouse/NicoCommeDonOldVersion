import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Token from './Token';
import CommentPage from './CommentPage';

const Router = () => (
    <BrowserRouter>
        <div>
            <Route exact path='/'>
                <Token />
            </Route>
            <Route exact path='/main' >
                <CommentPage />
            </Route>
        </div>
    </BrowserRouter>
)

export default Router;