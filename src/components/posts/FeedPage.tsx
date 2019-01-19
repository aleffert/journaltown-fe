import React from 'react';

import { bindDispatch, pick, resultIsLoading } from '../../utils';
import { actions, AppState } from '../../store';
import { FeedPost } from './FeedPost';
import { connect } from 'react-redux';
import { Container, Button, Grid, Message } from 'semantic-ui-react';
import strings from '../../strings';
import { L } from '../localization/L';
import { sortPosts, oldestCreatedDate, newestModifiedDate, shouldShowLoadMore } from './feed-helpers';

const mapStateToProps = (state: AppState) => pick(state, ['feed']);
const mapDispatchToProps = bindDispatch(pick(actions, ['feed', 'history']));

type FeedPageStateProps = ReturnType<typeof mapStateToProps>;
type FeedPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type FeedPageProps = FeedPageStateProps & FeedPageDispatchProps;


export class _FeedPage extends React.Component<FeedPageProps> {

    constructor(props: FeedPageProps) {
        super(props);
        this.onLoadMore = this.onLoadMore.bind(this);
    }

    componentDidMount() {
        const since = oldestCreatedDate(Object.values(this.props.feed.posts));
        this.props.actions.feed.loadChangedPosts({since});
    }

    onLoadMore() {
        const since = newestModifiedDate(Object.values(this.props.feed.posts));
        this.props.actions.feed.loadNextPosts({since});
    }

    render() {
        const posts = sortPosts(this.props.feed.posts);
        const showLoadMore = shouldShowLoadMore(this.props.feed.nextPostsResult);
        const isLoading = resultIsLoading(this.props.feed.nextPostsResult);
        return <Container>
            <Grid textAlign="center">
            {posts.map(post => <Grid.Row key={post.id}><FeedPost post={post}></FeedPost></Grid.Row>)}
            {showLoadMore ? 
                <Grid.Column width={6}>
                    <Button id="load-more-button" fluid secondary loading={isLoading} onClick={this.onLoadMore}>
                        <L>{strings.feed.loadMore}</L>
                    </Button>
                </Grid.Column>
                : <Message><L>{strings.feed.allPostsLoaded}</L></Message>}
                
            </Grid>
        </Container>;
    }
}

export const FeedPage = connect(mapStateToProps, mapDispatchToProps)(_FeedPage)