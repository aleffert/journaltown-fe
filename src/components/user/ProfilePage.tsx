import React from 'react';
import { AppState, actions } from '../../store';
import { pick, bindDispatch, safeGet, hasContent, isSuccess } from '../../utils';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { List, Header } from 'semantic-ui-react';
import { AsyncView } from '../widgets/AsyncView';
import strings from '../../strings';
import { L } from '../localization/L';
import { Link } from 'react-router-dom';
import { renderNavigationPath } from '../../store/navigation';
import { IsFollowingUserView } from '../widgets/IsFollowingUserView';
import { FollowsUserView } from '../widgets/FollowsUserView';


const mapStateToProps = (state: AppState) => pick(state, ['user', 'follows']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user', 'follows']));

type ProfilePageStateProps = ReturnType<typeof mapStateToProps>;
type ProfilePageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type ProfilePageProps =
    & ProfilePageStateProps
    & ProfilePageDispatchProps 
    & RouteComponentProps<{username: string}>;

export class _ProfilePage extends React.Component<ProfilePageProps> {

    loadUser() {
        const username = this.props.match.params.username;
        const profile = this.props.user.profiles[username];
        this.props.actions.user.loadUser({username, current: profile});
        if(isSuccess(this.props.user.currentUserResult)) {
            const currentUsername = this.props.user.currentUserResult.value.username;
            this.props.actions.follows.loadUserFollowing({username, currentUsername});
        }
    }

    componentDidMount() {
        this.loadUser();
    }

    componentDidUpdate(prevProps: ProfilePageProps) {
        if (this.props.match.params.username !== prevProps.match.params.username) {
          this.loadUser();
        }
      }

    render() {
        const user = this.props.user.profiles[this.props.match.params.username];
        return <AsyncView result={user}>{u =>  {
            const currentUser = (
                isSuccess(this.props.user.currentUserResult) 
                    && this.props.user.currentUserResult.value.username === u.username 
            ) ? this.props.user.currentUserResult.value : null;
            const bio = safeGet(u['profile'], 'bio');
            const following = (u.following || []).find(f => !!currentUser && f.username === currentUser.username);
            return <List relaxed>
                <List.Item>
                    <Header as="h2">{u.username}</Header>
                </List.Item>
                <List.Item>
                    <IsFollowingUserView following={!!following} username={u.username}/>
                </List.Item>
                <List.Item>
                    <FollowsUserView currentUser={currentUser} targetUser={u}/>
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
                <Header as="h3">Followers</Header>
                {u.followers && u.followers.length > 0 ? <List horizontal bulleted>{u.followers.map(u => <List.Item key={u.username}><Link to={renderNavigationPath({type: 'view-profile', username: u.username})}>{u.username}</Link></List.Item>)}</List> : "None"}
                <Header as="h3">Following</Header>
                {u.following && u.following.length > 0 ? <List horizontal bulleted>{u.following.map(u => <List.Item key={u.username}><Link to={renderNavigationPath({type: 'view-profile', username: u.username})}>{u.username}</Link></List.Item>)}</List> : "None"}
                </List.Item>
            </List>
        }}</AsyncView>
    }
}

export const ProfilePage = connect(mapStateToProps, mapDispatchToProps)(_ProfilePage);