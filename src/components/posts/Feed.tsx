import React from 'react';

import { isLoading, isSuccess, safeGet } from '../../utils';
import { FeedPost } from './FeedPost';
import { Container, Button, Grid, Message } from 'semantic-ui-react';
import strings from '../../strings';
import { L } from '../localization/L';
import { sortPosts, oldestCreatedDate, newestModifiedDate, shouldShowLoadMore } from './feed-helpers';
import { keyForFilters } from '../../store/feed';
import { PostsFeedFilters } from '../../services/api/requests';
import { AppState, actions } from '../../store';

type FeedStateProps = Pick<AppState, 'feed' | 'user'>
type FeedeDispatchProps = {actions: Pick<typeof actions, 'feed' | 'user' | 'delete'>}
export type FeedProps = {
    filters: PostsFeedFilters
} & FeedStateProps & FeedeDispatchProps;

export class Feed extends React.Component<FeedProps> {

    constructor(props: FeedProps) {
        super(props);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        const filters = this.props.filters;
        const since = oldestCreatedDate(Object.values(this.props.feed.posts));
        this.props.actions.feed.loadChangedPosts({filters, since});
    }

    onLoadMore() {
        const filters = this.props.filters;
        const since = newestModifiedDate(Object.values(this.props.feed.posts));
        this.props.actions.feed.loadNextPosts({filters, since});
    }

    onDelete(postId: number) {
        this.props.actions.delete.sendDeletePost({postId: postId});
    }

    render() {
        const currentUser = this.props.user.currentUserResult;
        const posts = sortPosts(this.props.feed.posts);
        const filters = this.props.filters;
        const nextPostsResult = safeGet(this.props.feed.feeds[keyForFilters(filters)], 'nextPostsResult');
        // TODO: Don't show load more area at all unless we've done an initial load
        const showLoadMore = shouldShowLoadMore(nextPostsResult)
        const loading = isLoading(nextPostsResult);
        return <Container>
            <Grid textAlign="center" divided='vertically'>
            {posts.map(post =>
                <Grid.Row key={post.id}>
                    <FeedPost post={post} currentUser={currentUser} onDelete={() => this.onDelete(post.id)}/>
                </Grid.Row>
            )}
            {showLoadMore ? 
                <Grid.Column width={6}>
                    <Button id="load-more-button" fluid secondary loading={loading} onClick={this.onLoadMore}>
                        <L>{strings.feed.loadMore}</L>
                    </Button>
                </Grid.Column>
                : <Message><L>{strings.feed.allPostsLoaded}</L></Message>}
                
            </Grid>
        </Container>;
    }
}
