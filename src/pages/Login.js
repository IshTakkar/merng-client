import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';

const Login = (props) => {

    const [errors, setErrors] = useState({});
    const initialState = {
        username: '',
        password: ''
    }

    const { onChange, onSubmit, values } = useForm(loginUserCallback, initialState);

    const context = useContext(AuthContext);
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, result) {
            // console.log(result);
            context.login(result.data.login);
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    function loginUserCallback() {
        loginUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username"
                    name="username"
                    type="text"
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange}
                />
                
                <Form.Input
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    error={errors.password ? true : false}
                    value={values.password}
                    onChange={onChange}
                />
                
                <Button type="submit" color="red" loading={loading ? true : false}>Login</Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ){
        login(
            username: $username
            password: $password
        ) {
            id email username createdAt token
        }
    }
`;

export default Login;