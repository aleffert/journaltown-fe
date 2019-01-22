import React from 'react';
import { pick, bindDispatch } from '../../utils';
import { AppState, actions } from '../../store';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { FeedPost } from './FeedPost';
import { ApiErrorView } from '../widgets/ErrorView';
import { InitialLoader } from '../user/InitialLoader';

const mapStateToProps = (state: AppState) => pick(state, ['feed', 'router', 'post', 'user']);
const mapDispatchToProps = bindDispatch(pick(actions, ['feed', 'history', 'post', 'delete']));


type PostPageStateProps = ReturnType<typeof mapStateToProps>;
type PostPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type PostPageProps =
    & PostPageStateProps
    & PostPageDispatchProps
    & RouteComponentProps<{authorId: string, postId: string}>;
export class _PostPage extends React.Component<PostPageProps> {

    constructor(props: PostPageProps) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        const postId = Number.parseInt(this.props.match.params.postId);
        const current = this.props.post.posts[postId];
        this.props.actions.post.loadPost({postId, current});
    }

    onDelete() {
        const postId = Number.parseInt(this.props.match.params.postId);
        this.props.actions.delete.sendDeletePost({postId, redirect: {type: 'main'}});
    }

    render() {
        const postId = Number.parseInt(this.props.match.params.postId);
        const currentPost = this.props.post.posts[postId];
        if(!currentPost) {
            return null;
        }
        switch(currentPost.type) {
            case 'loading':
                return <InitialLoader/>;
            case 'failure':
                return <ApiErrorView error={currentPost.error}/>;
            case 'success':
                return <FeedPost
                    post={currentPost.value}
                    currentUser={this.props.user.currentUserResult}
                    onDelete={this.onDelete}
                />
        }
    }
}

export const PostPage = connect(mapStateToProps, mapDispatchToProps)(_PostPage);