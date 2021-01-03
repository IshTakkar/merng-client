import React, { useState } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { FETCH_POSTS_QUERY } from '../util/graphql';

const ModalOpen = ({ postId, commentId, callback }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

    const [deletePostorComment] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: data.getPosts.filter(p => p.id !== postId) } });
            }
            if (callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    });

    return (
        <Modal
            basic
            onClose={() => setConfirmOpen(false)}
            onOpen={() => setConfirmOpen(true)}
            dimmer="blurring"
            open={confirmOpen}
            size='small'
            trigger={
                <Button
                    as="div"
                    color="red"
                    floated="right"
                    size="mini"
                    onClick={() => setConfirmOpen(true)}>
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            }>
            <Header icon>
                <Icon name='archive' />
                Delete Post?
            </Header>
            <Modal.Content>
                <p>
                    The comments and likes associated with this post will be removed. Proceed?
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button basic color='red' inverted onClick={() => setConfirmOpen(false)}>
                    <Icon name='remove' /> No
                </Button>
                <Button color='green' inverted onClick={deletePostorComment}>
                    <Icon name='checkmark' /> Yes
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

const DELETE_POST = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`;

export default ModalOpen;