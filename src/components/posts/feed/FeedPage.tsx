import React from 'react';
import _ from 'lodash';

import { bindDispatch, pick, Optional } from '../../../utils';
import { actions, AppState } from '../../../store';
import { FeedPost } from './FeedPost';
import { connect } from 'react-redux';
import { Container, Button, Grid, Message } from 'semantic-ui-react';
import { Post } from '../../../services/api/models';
import strings from '../../../strings';
import { L } from '../../localization/L';


const mapStateToProps = (state: AppState) => pick(state, ['feed']);
const mapDispatchToProps = bindDispatch(pick(actions, ['feed', 'history']));

type FeedPageStateProps = ReturnType<typeof mapStateToProps>;
type FeedPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type FeedPageProps = FeedPageStateProps & FeedPageDispatchProps;

function shouldShowLoadMore(nextPostResult: FeedPageStateProps['feed']['nextPostsResult']) {
    if(nextPostResult && nextPostResult.type === 'success') {
        return nextPostResult.value.length > 1;
    }
    return true;
}

function lastPostDateTime(posts: Post[]) {
    return _.reduce(posts, (acc: Optional<string>, post: Post) => {
        if(!acc) {
            return post.created_at
        }
        else {
            return [post.created_at, acc].sort()[1];
        }
    }, undefined);
}

export class _FeedPage extends React.Component<FeedPageProps> {

    constructor(props: FeedPageProps) {
        super(props);
        this.onLoadMore = this.onLoadMore.bind(this);
    }

    componentDidMount() {
        this.props.actions.feed.loadChangedPosts({since: undefined});
    }

    onLoadMore() {
        const since = lastPostDateTime(Object.values(this.props.feed.posts));
        this.props.actions.feed.loadNextPosts({since});
    }

    render() {
        const posts = _.orderBy(Object.values(this.props.feed.posts), 'created_at', 'desc');
        const showLoadMore = shouldShowLoadMore(this.props.feed.nextPostsResult);
        const isLoading = this.props.feed.nextPostsResult && this.props.feed.nextPostsResult.type === "loading" || undefined
        return <Container>
            <Grid textAlign="center">
            {posts.map(post => <Grid.Row key={post.id}><FeedPost post={post}></FeedPost></Grid.Row>)}
            {showLoadMore ? 
                <Grid.Column width={6}>
                    <Button fluid secondary loading={isLoading} onClick={this.onLoadMore}><L>{strings.feed.loadMore}</L></Button>
                </Grid.Column>
                : <Message><L>{strings.feed.allPostsLoaded}</L></Message>}
                
            </Grid>
        </Container>;
    }
}

export const FeedPage = connect(mapStateToProps, mapDispatchToProps)(_FeedPage)