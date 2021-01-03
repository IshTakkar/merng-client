import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
    {
        getPosts{
        id username body createdAt likeCount
        likes{
            username
        }
        commentCount
        comments{
            id body username createdAt
        }
    }
    }
`;