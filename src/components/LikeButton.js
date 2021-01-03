import React, { useEffect, useState } from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

const LikeButton = ({ post: { id, likes, likeCount }, user }) => {
    
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true);
        } else setLiked(false);
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST, {
        variables: {postId: id}
    })

    const likeButton = user ? (
        liked ? (
            <Button color='red'>
                <Icon name='heart' />
            </Button>
        ) : (
                <Button color='red' basic>
                    <Icon name='heart' />
                </Button>
            )
    ) : (
            <Button as={Link} to="/login" color='red' basic>
                <Icon name='heart' />
            </Button>
        );

    return (
        <Button as="div" labelPosition='right' onClick={user && likePost}>
            {likeButton}
            <Label basic color='red' pointing='left'> {likeCount} </Label>
        </Button>
    );
};

const LIKE_POST = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id username createdAt
            }
            likeCount
        }
    }
`;

export default LikeButton;