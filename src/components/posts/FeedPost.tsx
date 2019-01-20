import React from 'react';
import { Post } from '../../services/api/models';
import { Container, Header, Grid } from 'semantic-ui-react';
import { renderNavigationAction } from '../../store/navigation';

type FeedPostProps = {post: Post};

export class FeedPost extends React.Component<FeedPostProps> {

    render() {
        const action = {'type': 'post' as 'post', id: this.props.post.id, username: this.props.post.author.username}
        const path = renderNavigationAction(action);
        return <Container>
            <Grid>
                <Grid.Row>
                    <Header>{this.props.post.title}</Header>
                </Grid.Row>
                <Grid.Row>
                    {this.props.post.body}
                </Grid.Row>
                <Grid.Row>
                    <a href={path.pathname}>Link</a>
                </Grid.Row>
            </Grid>
        </Container>
    }
}