import React from 'react';
import { AppState, actions } from '../../store';
import { pick, bindDispatch, safeGet, hasContent, isSuccess } from '../../utils';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { List, Header, Button } from 'semantic-ui-react';
import { AsyncView } from '../widgets/AsyncView';
import strings from '../../strings';
import { L } from '../localization/L';
import { Link } from 'react-router-dom';
import { renderNavigationPath } from '../../store/navigation';


const mapStateToProps = (state: AppState) => pick(state, ['user']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user']));

type ProfilePageStateProps = ReturnType<typeof mapStateToProps>;
type ProfilePageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type ProfilePageProps =
    & ProfilePageStateProps
    & ProfilePageDispatchProps 
    & RouteComponentProps<{username: string}>;

export class _ProfilePage extends React.Component<ProfilePageProps> {

    componentDidMount() {
        const username = this.props.match.params.username;
        const current = this.props.user.users[username];
        this.props.actions.user.loadUser({username, current});
    }

    render() {
        const username = this.props.match.params.username;
        const currentUser = this.props.user.users[username];
        return <AsyncView result={currentUser}>{v =>  {
            const currentUser = isSuccess(this.props.user.currentUserResult) && this.props.user.currentUserResult.value.username === v.username ? this.props.user.currentUserResult.value : null;
            const bio = safeGet(v['profile'], 'bio');
            return <List relaxed>
                <List.Item>
                    <Header as="h2">{this.props.match.params.username}</Header>
                </List.Item>
                {currentUser
                ? currentUser.email
                : null
                }
                {hasContent(bio) ? <List.Item>
                    <label><L>{strings.user.profile.biography}</L></label>
                    <p>{bio}</p>
                </List.Item> : null}
                {currentUser
                    ? <List.Item><Link to={renderNavigationPath({type: 'edit-profile', username: username})}><L>{strings.user.profile.edit}</L></Link></List.Item>
                    : null
                }
            </List>
        }}</AsyncView>
    }
}

export const ProfilePage = connect(mapStateToProps, mapDispatchToProps)(_ProfilePage);