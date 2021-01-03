import React, { useContext } from 'react';
import { Card, Label, Icon, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import ModalOpen from './ModalOpen';

const PostCard = ({ post: { body, id, username, createdAt, likeCount, commentCount, likes } }) => {

    const commentPost = () => {

    }

    const { user } = useContext(AuthContext);

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Button as={Link} to={'/posts/' + id} labelPosition='right'>
                    <Button color='black' basic>
                        <Icon name='comment' />
                    </Button>
                    <Label basic color='black' pointing='left'> {commentCount} </Label>
                </Button>
                {user && user.username === username && (
                    //<DeleteButton postId={id} />
                    <ModalOpen postId={id}/>
                )}
            </Card.Content>
        </Card>
    );
};

export default PostCard;