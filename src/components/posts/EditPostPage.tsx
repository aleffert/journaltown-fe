import React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

import { AppState, actions } from "../../store";
import { pick, bindDispatch, isSuccess, isFailure, isLoading } from "../../utils";
import { ComposePostForm } from './ComposePostForm';
import { Container, Grid, InputOnChangeData, Message, TextAreaProps } from 'semantic-ui-react';
import { isString } from 'util';
import strings from '../../strings';
import { L } from '../localization/L';
import { AsyncView } from '../widgets/AsyncView';

const mapStateToProps = (state: AppState) => pick(state, ['compose']);
const mapDispatchToProps = bindDispatch(pick(actions, ['compose', 'post']));

type EditPostPageStateProps = ReturnType<typeof mapStateToProps>;
type EditPostPageDispatchProps = ReturnType<typeof mapDispatchToProps>;

type EditPostPageProps = 
    & EditPostPageStateProps
    & EditPostPageDispatchProps
    & RouteComponentProps<{postId: string, username: string}>
export class _EditPostPage extends React.Component<EditPostPageProps> {

    constructor(props: EditPostPageProps) {
        super(props);

        this.onBodyChange = this.onBodyChange.bind(this);
        this.onPost = this.onPost.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
    }

    componentDidMount() {
        const postId = Number.parseInt(this.props.match.params.postId);
        this.props.actions.compose.startEditingPost(postId);
    }

    onTitleChange(_: any, d: InputOnChangeData) {
        this.props.actions.compose.setTitle(d.value);
    }

    onBodyChange(_: any, d: TextAreaProps) {
        const body = isString(d.value) ? d.value : '';
        this.props.actions.compose.setBody(body);
    }

    onPost() {
        const title = this.props.compose.title;
        const body = this.props.compose.body;
        const postId = Number.parseInt(this.props.match.params.postId);
        this.props.actions.compose.update({postId, draft: {title, body}});
    }

    renderEditor() {
        const submitDisabled = this.props.compose.body.length === 0 || !!this.props.compose.updatePostResult;
        const success = isSuccess(this.props.compose.updatePostResult);
        const failure = isFailure(this.props.compose.updatePostResult);
        const loading = isLoading(this.props.compose.updatePostResult);
        return (
            <Container text>
                <Grid>
                    <Grid.Column textAlign="right">
                        <ComposePostForm
                            {...this.props.compose}
                            onTitleChange={this.onTitleChange}
                            onBodyChange={this.onBodyChange}
                            onPost={this.onPost}
                            submitDisabled={submitDisabled}
                            isLoading={loading}
                            submitMode='update'
                        />
                        {success ? <Message positive><L>{strings.edit.sendSuccess}</L></Message> : null}
                        {failure ? <Message error><L>{strings.edit.sendFailure}</L></Message> : null}
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }

    render() {
        return <AsyncView result={this.props.compose.existingPostResult}>{
            v => this.renderEditor()
        }</AsyncView>
    }
}

export const EditPostPage = connect(mapStateToProps, mapDispatchToProps)(_EditPostPage);