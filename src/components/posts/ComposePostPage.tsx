import React from 'react';
import { Container, Grid, InputOnChangeData, Message, TextAreaProps } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withLanguage, LanguageProps, L } from '../localization/L';
import { isString, bindDispatch, pick, isLoading, isSuccess, isFailure } from '../../utils';
import { AppState, actions } from '../../store';
import { ComposePostForm } from './ComposePostForm';
import strings from '../../strings';

const mapStateToProps = (state: AppState) => pick(state, ['compose']);
const mapDispatchToProps = bindDispatch(pick(actions, ['compose']));

type ComposePostPageStateProps = ReturnType<typeof mapStateToProps>;
type ComposePostPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type ComposePostPageProps = ComposePostPageStateProps & ComposePostPageDispatchProps & LanguageProps;

export class _ComposePostPage extends React.Component<ComposePostPageProps, {}> {

    constructor(props: ComposePostPageProps) {
        super(props);

        this.onBodyChange = this.onBodyChange.bind(this);
        this.onPost = this.onPost.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
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
        this.props.actions.compose.post({title, body});
    }

    render() {
        const submitDisabled = this.props.compose.body.length === 0 || !!this.props.compose.createPostResult;
        const success = isSuccess(this.props.compose.createPostResult);
        const failure = isFailure(this.props.compose.createPostResult);
        const loading = isLoading(this.props.compose.createPostResult);
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
                            submitMode='post'
                        />
                        {success ? <Message positive><L>{strings.compose.sendSuccess}</L></Message> : null}
                        {failure ? <Message error><L>{strings.compose.sendFailure}</L></Message> : null}
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

export const ComposePostPage = connect(mapStateToProps, mapDispatchToProps)(
    withLanguage<ComposePostPageProps, typeof _ComposePostPage>(_ComposePostPage)
);