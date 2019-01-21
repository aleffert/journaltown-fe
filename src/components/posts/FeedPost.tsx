import React from 'react';
import { Post } from '../../services/api/models';
import { Container, Header, Grid } from 'semantic-ui-react';
import { PostActions } from './PostActions';
import { CurrentUserResult } from '../../services/api/requests';
import { Async } from '../../utils';
import { canEditPost } from './feed-helpers';

type FeedPostProps = {
    post: Post,
    currentUser: Async<CurrentUserResult>
};

export class FeedPost extends React.Component<FeedPostProps> {
    render() {
        const canEdit = canEditPost(this.props.post, this.props.currentUser);
        return <Container>
            <Grid>
                <Grid.Row>
                    <Header>{this.props.post.title}</Header>
                </Grid.Row>
                <Grid.Row>
                    {this.props.post.body}
                </Grid.Row>
                <Grid.Row>
                    <PostActions post={this.props.post} canEdit={canEdit}/>
                </Grid.Row>
            </Grid>
        </Container>
    }
}