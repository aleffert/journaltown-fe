import React from 'react';

import { bindDispatch, pick, isLoading } from '../../utils';
import { actions, AppState } from '../../store';
import { FeedPost } from './FeedPost';
import { connect } from 'react-redux';
import { Container, Button, Grid, Message } from 'semantic-ui-react';
import strings from '../../strings';
import { L } from '../localization/L';
import { sortPosts, oldestCreatedDate, newestModifiedDate, shouldShowLoadMore } from './feed-helpers';

const mapStateToProps = (state: AppState) => pick(state, ['feed', 'user']);
const mapDispatchToProps = bindDispatch(pick(actions, ['feed', 'history', 'delete']));

type FeedPageStateProps = ReturnType<typeof mapStateToProps>;
type FeedPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type FeedPageProps = FeedPageStateProps & FeedPageDispatchProps;


export class _FeedPage extends React.Component<FeedPageProps> {

    constructor(props: FeedPageProps) {
        super(props);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        const since = oldestCreatedDate(Object.values(this.props.feed.posts));
        this.props.actions.feed.loadChangedPosts({since});
    }

    onLoadMore() {
        const since = newestModifiedDate(Object.values(this.props.feed.posts));
        this.props.actions.feed.loadNextPosts({since});
    }

    onDelete(postId: number) {
        this.props.actions.delete.sendDeletePost({postId: postId});
    }

    render() {
        const currentUser = this.props.user.currentUserResult;
        const posts = sortPosts(this.props.feed.posts);
        const showLoadMore = shouldShowLoadMore(this.props.feed.nextPostsResult);
        const loading = isLoading(this.props.feed.nextPostsResult);
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

export const FeedPage = connect(mapStateToProps, mapDispatchToProps)(_FeedPage)