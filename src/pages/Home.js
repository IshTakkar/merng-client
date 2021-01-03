import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import PostForm from '../components/PostForm.js';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/auth';

const Home = () => {
    const { user } = useContext(AuthContext);
    const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY);

    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Row>
                        <PostForm />
                    </Grid.Row>
                )}
                {loading ? (
                    <h1>Loading Posts...</h1>
                ) : (
                        <Transition.Group>
                            {
                                posts && posts.map(post => (
                                    <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                        <PostCard post={post} />
                                    </Grid.Column>
                                ))
                            }
                        </Transition.Group>
                )}
            </Grid.Row>
        </Grid>
    );
};

export default Home;