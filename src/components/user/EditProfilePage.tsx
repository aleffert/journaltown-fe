import React from 'react';
import { AppState, actions } from "../../store";
import { pick, bindDispatch, isSuccess, isString } from "../../utils";
import { RouteComponentProps } from "react-router";
import { connect } from 'react-redux';
import { AsyncView } from '../widgets/AsyncView';
import { Form, Header, Container, Grid, TextAreaProps } from 'semantic-ui-react';
import strings from '../../strings';
import { L } from '../localization/L';
import produce from 'immer';


const mapStateToProps = (state: AppState) => pick(state, ['user']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user']));

type EditProfilePageStateProps = ReturnType<typeof mapStateToProps>;
type EditProfilePageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type EditProfilePageProps =
    & EditProfilePageStateProps
    & EditProfilePageDispatchProps 
    & RouteComponentProps<{username: string}>;


export class _EditProfilePage extends React.Component<EditProfilePageProps> {

    constructor(props: EditProfilePageProps) {
        super(props);

        this.onBioChanged = this.onBioChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if(isSuccess(this.props.user.currentUserResult)) {
            this.props.actions.user.setDraftProfile(
                this.props.user.currentUserResult.value.profile
            );
        }
    }

    onBioChanged(_: unknown, d: TextAreaProps) {
        const profile = produce(this.props.user.draftProfile, draftState => {
            draftState.bio = isString(d.value) ? d.value : '';
        });
        this.props.actions.user.setDraftProfile(profile);
    }

    onSubmit() {
        const username = this.props.match.params.username;
        this.props.actions.user.updateProfile({username, profile: this.props.user.draftProfile});
    }

    render() {
        return <AsyncView result={this.props.user.currentUserResult}>{v => {
            return (
                <Container text>
                <Grid>
                    <Grid.Column>
                    <Form>
                        <Header>{v.username}</Header>
                        <label><L>{strings.user.profile.fieldDescriptions.bio}</L></label>
                        <Form.TextArea value={this.props.user.draftProfile.bio || ''} onChange={this.onBioChanged}></Form.TextArea>
                        <Container textAlign="right">
                            <Form.Button primary onClick={this.onSubmit}><L>{strings.common.save}</L></Form.Button>
                        </Container>
                    </Form>
                    </Grid.Column>
                </Grid>
            </Container>
            );
        }}
        </AsyncView>
    }
}

export const EditProfilePage = connect(mapStateToProps, mapDispatchToProps)(_EditProfilePage)