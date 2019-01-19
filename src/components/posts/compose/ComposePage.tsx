import React from 'react';
import { connect } from 'react-redux';
import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { withLanguage, LanguageProps } from '../../localization/L';
import { isString, bindDispatch, pick } from '../../../utils';
import { AppState, actions } from '../../../store';
import { ComposeForm } from './ComposeForm';

const mapStateToProps = (state: AppState) => pick(state, ['compose']);
const mapDispatchToProps = bindDispatch(pick(actions, ['compose']));

type ComposePageStateProps = ReturnType<typeof mapStateToProps>;
type ComposePageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type ComposePageProps = ComposePageStateProps & ComposePageDispatchProps & LanguageProps;

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
        return <ComposeForm
            {...this.props.compose}
            onTitleChange={this.onTitleChange}
            onBodyChange={this.onBodyChange}
            onPost={this.onPost}
        />
    }
}

export const ComposePage = connect(mapStateToProps, mapDispatchToProps)(
    withLanguage<ComposePageProps, typeof _ComposePage>(_ComposePage)
);