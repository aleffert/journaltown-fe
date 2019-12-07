import React from 'react';
import { pick, bindDispatch, isFailure, LocalizedString, isSuccess, resultJoin } from "../../utils";
import { AppState, actions } from "../../store";
import { connect } from 'react-redux';
import { RouteComponentProps } from "react-router";
import { AsyncView } from '../widgets/AsyncView';
import { EditGroupForm } from './EditGroupForm';
import { Message } from 'semantic-ui-react';
import { L } from '../localization/L';
import strings from '../../strings';
import { AppError } from '../../utils/errors';

const mapStateToProps = (state: AppState) => pick(state, ['user', 'friendGroup']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user', 'friendGroup']));

type EditGroupPageStateProps = ReturnType<typeof mapStateToProps>;
type EditGroupPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type EditGroupPageProps =
    & EditGroupPageStateProps
    & EditGroupPageDispatchProps
    & RouteComponentProps<{username: string, id: string}>;

class _EditGroupPage extends React.Component<EditGroupPageProps> {

    constructor(props: EditGroupPageProps) {
        super(props);

        this.onNameChange = this.onNameChange.bind(this);
        this.onSelectedFriends = this.onSelectedFriends.bind(this);
        this.onSaveGroup = this.onSaveGroup.bind(this);
    }

    loadUser() {
        const username = this.props.match.params.username;
        const profile = this.props.user.profiles[username];
        this.props.actions.user.loadUser({username, current: profile});
    }

    componentDidMount() {
        if(isSuccess(this.props.user.currentUserResult)) {
            this.loadUser();
            const groupId = Number.parseInt(this.props.match.params.id);
            const username = this.props.user.currentUserResult.value.username;
            this.props.actions.friendGroup.startEditingGroup({username, groupId});
        }
        else {
            console.error('Current user unexpectedly not present');
        }
    }

    onNameChange(value: string) {
        this.props.actions.friendGroup.setName(value);
    }

    onSelectedFriends(value: string[]) {
        this.props.actions.friendGroup.setSelectedFriends(value);
    }

    onSaveGroup() {
        if(isSuccess(this.props.user.currentUserResult)) {
            const groupId = Number.parseInt(this.props.match.params.id);
            const username = this.props.user.currentUserResult.value.username;
            const members = this.props.friendGroup.selectedFriends;
            const groupName = this.props.friendGroup.name;
            this.props.actions.friendGroup.saveGroup({
                username,
                groupId,
                members,
                groupName
            });
        }
        else {
            console.error('Current user unexpectedly not present');
        }
    }

    messageForError(error: AppError): LocalizedString {
        switch(error.type) {
            case 'name-in-use':
                return strings.errors.groupAlreadyExists;
            case 'connection':
                return strings.errors.connectionError;
            default:
                return strings.errors.unknown;
        }
    }

    render() {
        const username = this.props.match.params.username;
        const userProfileResult = this.props.user.profiles[username];
        const groupResult = this.props.friendGroup.editingGroupResult;
        return <AsyncView result={resultJoin(userProfileResult, groupResult)}>{
            ([user, _]) => {
                return (
                    <div>
                    <EditGroupForm
                        allFriends={(user.following || []).map(u => u.username)}
                        selectedFriends={this.props.friendGroup.selectedFriends}
                        onSelectedFriends={this.onSelectedFriends}
                        onNameChange={this.onNameChange}
                        onSubmit={this.onSaveGroup}
                        name={this.props.friendGroup.name}
                        kind='update'
                    />
                    {isFailure(this.props.friendGroup.createGroupResult)
                    ? <Message negative><L>{this.messageForError(this.props.friendGroup.createGroupResult.error)}</L></Message>
                    : null
                    }
                    </div>
                );
            }
        }
        </AsyncView>
    }
}

export const EditGroupPage = connect(mapStateToProps, mapDispatchToProps)(_EditGroupPage);