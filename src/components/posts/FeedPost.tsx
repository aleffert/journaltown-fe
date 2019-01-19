import React from 'react';
import { Post } from '../../services/api/models';
import { Container, Header } from 'semantic-ui-react';

type FeedPostProps = {post: Post};

export class FeedPost extends React.Component<FeedPostProps> {

    render() {
        return <Container>
            <Header>{this.props.post.title}</Header>
            {this.props.post.body}
        </Container>
    }
}