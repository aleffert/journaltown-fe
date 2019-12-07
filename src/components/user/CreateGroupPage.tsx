import React from 'react';
import { RouteComponentProps } from 'react-router';
import { AppState, actions } from '../../store';
import { bindDispatch, pick, isFailure, LocalizedString } from '../../utils';
import { EditGroupForm } from './EditGroupForm';
import { connect } from 'react-redux';
import { AsyncView } from '../widgets/AsyncView';
import { Message } from 'semantic-ui-react';
import strings from '../../strings';
import { L } from '../localization/L';
import { AppError } from '../../utils/errors';

const mapStateToProps = (state: AppState) => pick(state, ['user', 'friendGroup']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user', 'friendGroup']));

type CreateGroupPageStateProps = ReturnType<typeof mapStateToProps>;
type CreateGroupPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type CreateGroupPageProps =
    & CreateGroupPageStateProps
    & CreateGroupPageDispatchProps
    & RouteComponentProps<{username: string}>;

class _CreateGroupPage extends React.Component<CreateGroupPageProps> {

    constructor(props: CreateGroupPageProps) {
        super(props);

        this.onNameChange = this.onNameChange.bind(this);
        this.onSelectedFriends = this.onSelectedFriends.bind(this);
        this.onCreateGroup = this.onCreateGroup.bind(this);
    }

    loadUser() {
        const username = this.props.match.params.username;
        const profile = this.props.user.profiles[username];
        this.props.actions.user.loadUser({username, current: profile});
    }

    componentDidMount() {
        this.loadUser();
    }

    onNameChange(value: string) {
        this.props.actions.friendGroup.setName(value);
    }

    onSelectedFriends(value: string[]) {
        this.props.actions.friendGroup.setSelectedFriends(value);
    }

    onCreateGroup() {
        const username = this.props.match.params.username;
        const groupName = this.props.friendGroup.name;
        const members = this.props.friendGroup.selectedFriends;
        this.props.actions.friendGroup.createGroup({username, groupName, members});
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
        return <AsyncView result={this.props.user.profiles[username]}>{
            u => {
                return (
                    <div>
                    <EditGroupForm
                        allFriends={(u.following || []).map(u => u.username)}
                        selectedFriends={this.props.friendGroup.selectedFriends}
                        onSelectedFriends={this.onSelectedFriends}
                        onNameChange={this.onNameChange}
                        onSubmit={this.onCreateGroup}
                        name={this.props.friendGroup.name}
                        kind='create'
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

export const CreateGroupPage = connect(mapStateToProps, mapDispatchToProps)(_CreateGroupPage);