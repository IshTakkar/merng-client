import React, { useContext, useRef, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import { Segment, Dimmer, Loader, Image, Grid, Card, Form } from 'semantic-ui-react';
import moment from 'moment';
import { Button, Icon, Label } from 'semantic-ui-react';

import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import ModalOpen from '../components/ModalOpen';

const SinglePost = (props) => {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);

    const { data: { getPost } = {} } = useQuery(FETCH_POSTS, {
        variables: {
            postId
        }
    });

    const [comment, setComment] = useState('');

    const [createComment] = useMutation(CREATE_COMMENT, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    });

    function deletePostCallback() {
        props.history.push('/');
    }

    let postMarkup;
    if (!getPost) {
        postMarkup = (
            <Segment>
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
                <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
            </Segment>
        )
    } else {
        const { id, username, createdAt, body, likes, comments, likeCount, commentCount } = getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image 
                            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            size="small"
                            floated="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />
                                <Button as="div" labelPosition='right' onClick={() => console.log('Comment clicked!')}>
                                    <Button color='black' basic>
                                        <Icon name='comment' />
                                    </Button>
                                    <Label basic color='black' pointing='left'> {commentCount} </Label>
                                </Button>
                                {user && user.username === username && (
                                    <ModalOpen postId={id} callback={deletePostCallback}/>
                                )}
                            </Card.Content>
                        </Card>
                        {user && <Card fluid>
                            <Card.Content>
                                <p>Post a comment:</p>
                                <Form>
                                    <div className="ui action input fluid">
                                        <input
                                            type="text"
                                            name="comment"
                                            placeholder="Comment"
                                            value={comment}
                                            onChange={event => setComment(event.target.value)}
                                            ref={commentInputRef}
                                        />
                                        <button
                                            type="submit"
                                            className="ui button black"
                                            disabled={comment.trim() === ''}
                                            onClick={createComment}
                                        >
                                            Submit
                                    </button>
                                    </div>
                                </Form>
                            </Card.Content>
                        </Card>}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && comment.username === user.username && (
                                        <ModalOpen postId={postId} commentId={comment.id}/>
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
};

const CREATE_COMMENT = gql`
    mutation($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`;

const FETCH_POSTS = gql`
    query ($postId: ID!){
        getPost(postId: $postId) {
            id body createdAt username
            likes{
                username
            }
            likeCount
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`;

export default SinglePost;