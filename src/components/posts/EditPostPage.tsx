import React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

import { AppState, actions } from "../../store";
import { pick, bindDispatch, resultIsFailure, resultIsSuccess, resultIsLoading } from "../../utils";
import { ComposePostForm } from './ComposePostForm';
import { Container, Grid, InputOnChangeData, Message, TextAreaProps, Loader } from 'semantic-ui-react';
import { isString } from 'util';
import strings from '../../strings';
import { L } from '../localization/L';
import { ApiError } from '../../services';
import { InitialLoader } from '../user/InitialLoader';
import { ApiErrorView } from '../widgets/ErrorView';

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
        const submitDisabled = this.props.compose.body.length == 0 || !!this.props.compose.updatePostResult;
        const isSuccess = resultIsSuccess(this.props.compose.updatePostResult);
        const isFailure = resultIsFailure(this.props.compose.updatePostResult);
        const isLoading = resultIsLoading(this.props.compose.updatePostResult);
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
                            isLoading={isLoading}
                            submitMode='update'
                        />
                        {isSuccess ? <Message positive><L>{strings.edit.sendSuccess}</L></Message> : null}
                        {isFailure ? <Message error><L>{strings.edit.sendFailure}</L></Message> : null}
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }

    renderLoading() {
        return <InitialLoader/>;
    }

    renderError(error: ApiError) {
        return <ApiErrorView error={error}/>;
    }

    render() {
        if(this.props.compose.existingPostResult) {
            switch(this.props.compose.existingPostResult.type) {
                case 'success':
                    return this.renderEditor();
                case 'loading':
                    return this.renderLoading();
                case 'failure':
                    return this.renderError(this.props.compose.existingPostResult.error);
            }
        }
        else {
            return this.renderLoading();
        }
    }
}

export const EditPostPage = connect(mapStateToProps, mapDispatchToProps)(_EditPostPage);