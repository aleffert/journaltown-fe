import React from 'react';
import { connect } from 'react-redux';
import { Container, Form, Grid, InputOnChangeData, Message, TextAreaProps } from 'semantic-ui-react';
import { L, withLanguage, LanguageProps } from '../../localization/L';
import { isString, bindDispatch, pick } from '../../../utils';
import strings from '../../../strings';
import { AppState, actions } from '../../../store';

const mapStateToProps = (state: AppState) => pick(state, ['compose']);
const mapDispatchToProps = bindDispatch(pick(actions, ['compose']));

type ComposeStateProps = ReturnType<typeof mapStateToProps>;
type ComposeDispatchProps = ReturnType<typeof mapDispatchToProps>;
type ComposePageProps = ComposeStateProps & ComposeDispatchProps & LanguageProps;

export class _ComposePage extends React.Component<ComposePageProps, {}> {

    constructor(props: ComposePageProps) {
        super(props);

        this.onBodyChange = this.onBodyChange.bind(this);
        this.onPost = this.onPost.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
    }

    onTitleChange(_: any, d: InputOnChangeData) {
        this.props.actions.compose.setTitle({title: d.value});
    }

    onBodyChange(_: any, d: TextAreaProps) {
        const body = isString(d.value) ? d.value : '';
        this.props.actions.compose.setBody({body});
    }

    onPost() {
        const title = this.props.compose.title;
        const body = this.props.compose.body;
        this.props.actions.compose.post({title, body});
    }

    render() {
        const submitDisabled = this.props.compose.body.length == 0 || !!this.props.compose.postResult;
        const isSuccess = this.props.compose.postResult && this.props.compose.postResult.type === 'success';
        const isFailure = this.props.compose.postResult && this.props.compose.postResult.type === 'failure';
        const isLoading = (this.props.compose.postResult && this.props.compose.postResult.type === 'loading')  || undefined;
        return <Container text>
                <Grid>
                    <Grid.Column textAlign="right">
                        <Form>
                            <Form.Input size="huge" id='title-field'
                                placeholder={strings.post.title.placeholder[this.props.language]}
                                onChange={this.onTitleChange}
                            />
                            <Form.TextArea size="medium" id='body-field'
                                placeholder={strings.post.body.placeholder[this.props.language]}
                                onChange={this.onBodyChange}
                            />
                            <Form.Button primary disabled={submitDisabled} size="medium"
                                loading={isLoading}
                                onClick={this.onPost}
                            >
                            <L>{strings.post.post}</L>
                            </Form.Button>
                        </Form>
                        {isSuccess ? <Message positive><L>{strings.post.sendSuccess}</L></Message> : null}
                        {isFailure ? <Message error><L>{strings.post.sendFailure}</L></Message> : null}
                    </Grid.Column>
                </Grid>
        </Container>
    }
}

export const ComposePage = connect(mapStateToProps, mapDispatchToProps)(
    withLanguage<ComposePageProps, typeof _ComposePage>(_ComposePage)
);