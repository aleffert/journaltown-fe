import React from 'react';
import { connect } from 'react-redux';
import { Container, Form, Grid, InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
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

    }

    render() {
        const postDisabled = this.props.compose.body.length == 0;
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
                            <Form.Button primary disabled={postDisabled} size="medium"
                                onChange={this.onBodyChange}
                            >
                            <L>{strings.post.post}</L>
                            </Form.Button>
                        </Form>
                    </Grid.Column>
                </Grid>
        </Container>
    }
}

export const ComposePage = connect(mapStateToProps, mapDispatchToProps)(
    withLanguage<ComposePageProps, typeof _ComposePage>(_ComposePage)
);