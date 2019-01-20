import React from 'react';
import { pick, bindDispatch } from '../../utils';
import { AppState, actions } from '../../store';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Header, Container } from 'semantic-ui-react';

const mapStateToProps = (state: AppState) => pick(state, ['feed', 'router', 'post']);
const mapDispatchToProps = bindDispatch(pick(actions, ['feed', 'history', 'post']));


type PostPageStateProps = ReturnType<typeof mapStateToProps>;
type PostPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type PostPageProps =
    & PostPageStateProps
    & PostPageDispatchProps
    & RouteComponentProps<{authorId: string, postId: string}>;
export class _PostPage extends React.Component<PostPageProps> {

    componentDidMount() {
        debugger;
        const postId = Number.parseInt(this.props.match.params.postId);
        const current = this.props.post.posts[postId];
        this.props.actions.post.loadPost({postId, current});
    }

    render() {
        const postId = Number.parseInt(this.props.match.params.postId);
        const current = this.props.post.posts[postId];
        if(!current) {
            return null;
        }
        switch(current.type) {
            case 'loading':
                return 'loading';
            case 'failure':
                return 'page not found';
            case 'success':
                return <Container>
                    <Header>{current.value.title}</Header>
                    {current.value.body}
                </Container>
        }
    }
}

export const PostPage = connect(mapStateToProps, mapDispatchToProps)(_PostPage);