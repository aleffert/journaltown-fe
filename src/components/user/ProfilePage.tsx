import React from 'react';
import { AppState, actions } from '../../store';
import { pick, bindDispatch, safeGet, hasContent, resultJoin } from '../../utils';
import { orderBy } from 'lodash';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { List, Header, Button } from 'semantic-ui-react';
import { AsyncView } from '../widgets/AsyncView';
import strings from '../../strings';
import { L } from '../localization/L';
import { Link } from 'react-router-dom';
import { renderNavigationPath } from '../../store/navigation';
import { IsFollowingUserView } from '../widgets/IsFollowingUserView';
import { FollowsUserView } from '../widgets/FollowsUserView';


const mapStateToProps = (state: AppState) => pick(state, ['user', 'follows']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user', 'follows', 'navigation']));

type ProfilePageStateProps = ReturnType<typeof mapStateToProps>;
type ProfilePageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type ProfilePageProps =
    & ProfilePageStateProps
    & ProfilePageDispatchProps 
    & RouteComponentProps<{username: string}>;

export class _ProfilePage extends React.Component<ProfilePageProps> {

    constructor(props: ProfilePageProps) {
        super(props);
        this.onNewGroup = this.onNewGroup.bind(this);
    }

    loadUser() {
        const username = this.props.match.params.username;
        const profile = this.props.user.profiles[username];
        this.props.actions.user.loadUser({username, current: profile});
    }

    componentDidMount() {
        this.loadUser();
    }

    componentDidUpdate(prevProps: ProfilePageProps) {
        if (this.props.match.params.username !== prevProps.match.params.username) {
            this.loadUser();
        }
    }

    onNewGroup() {
        this.props.actions.navigation.to({type: 'create-group', username: this.props.match.params.username});
    }

    render() {
        const user = this.props.user.profiles[this.props.match.params.username];
        return <AsyncView result={resultJoin(user, this.props.user.currentUserResult)}>{([u, currentUser]) =>  {
            const viewingSelf = currentUser.username === u.username;
            const bio = safeGet(u['profile'], 'bio');
            const following = (u.following || []).find(f => viewingSelf && f.username === currentUser.username);
            return <List relaxed>
                <List.Item>
                    <Header as="h2">{u.username}</Header>
                </List.Item>
                <List.Item>
                    <IsFollowingUserView following={!!following} username={u.username}/>
                </List.Item>
                <List.Item>
                    <FollowsUserView currentUsername={safeGet(currentUser, 'username')} targetUsername={u.username}/>
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
                    ? <List.Item><Link to={renderNavigationPath({type: 'edit-profile', username: currentUser.username})}><L>{strings.user.profile.edit}</L></Link></List.Item>
                    : null
                }
                <List.Item>
                <Header as="h3"><L>{strings.user.profile.followers}</L></Header>
                {u.followers && u.followers.length > 0 ? <List horizontal bulleted>{u.followers.map(u => <List.Item key={u.username}><Link to={renderNavigationPath({type: 'view-profile', username: u.username})}>{u.username}</Link></List.Item>)}</List> : "None"}
                <Header as="h3"><L>{strings.user.profile.following}</L></Header>
                {u.following && u.following.length > 0 ? <List horizontal bulleted>{u.following.map(u => <List.Item key={u.username}><Link to={renderNavigationPath({type: 'view-profile', username: u.username})}>{u.username}</Link></List.Item>)}</List> : "None"}
                </List.Item>
                {currentUser
                ?
                    <List.Item>
                        <Header as="h3"><L>{strings.user.profile.groups}</L></Header>
                        {
                            currentUser.groups.length > 0 ?
                                <List horizontal bulleted>{
                                    orderBy(currentUser.groups, 'name')
                                        .map(
                                            group =>
                                                <List.Item key={group.id}>
                                                    <Link to={
                                                        renderNavigationPath({type: 'edit-group', id: group.id, username: u.username})
                                                    }>{group.name}</Link>
                                                </List.Item>
                                        )
                                }</List>: "You have no friend groups"}
                        <div><Button secondary onClick={this.onNewGroup}>New Group</Button></div>
                    </List.Item>
                : null
                }
            </List>
        }}</AsyncView>
    }
}

export const ProfilePage = connect(mapStateToProps, mapDispatchToProps)(_ProfilePage);