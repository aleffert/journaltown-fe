import React from 'react';
import { Button } from 'semantic-ui-react';
import { User, CurrentUser } from '../../services/api/models';
import { isLoading, pick, bindDispatch, Optional } from '../../utils';
import { AppState, actions } from '../../store';
import { connect, ConnectedComponentClass } from 'react-redux';

const mapStateToProps = (state: AppState) => pick(state, ['follows']);
const mapDispatchToProps = bindDispatch(pick(actions, ['follows']));

type FollowsUserViewStateProps = ReturnType<typeof mapStateToProps>;
type FollowsUserViewDispatchProps = ReturnType<typeof mapDispatchToProps>;
type FollowsUserViewBaseProps = {
    targetUser: User
    currentUser: Optional<CurrentUser>
};

type FollowsUserViewProps = FollowsUserViewBaseProps & FollowsUserViewStateProps & FollowsUserViewDispatchProps

export class _FollowsUserView extends React.Component<FollowsUserViewProps> {

    constructor(props: FollowsUserViewProps) {
        super(props);
        this.onToggleFollow = this.onToggleFollow.bind(this);
    }

    onToggleFollow(follow: boolean, currentUsername: string, username: string) {
        if(follow) {
            this.props.actions.follows.addUserFollowing({username, currentUsername});
        }
        else {
            this.props.actions.follows.removeUserFollowing({username, currentUsername});
        }
    }

    render() {
        if(this.props.currentUser) {
            const currentUser = this.props.currentUser;
            const targetUser = this.props.targetUser;
            const follows = this.props.follows.values[targetUser.username] || false;
            const loading = isLoading(this.props.follows.results[targetUser.username]);

            const text = follows ? "Unfollow" : "Follow";
            return <Button secondary={true} loading={loading} 
                onClick={() => this.onToggleFollow(!this.props.follows, currentUser.username, targetUser.username)}>{text}
            </Button>
        }
        else {
            return null;
        }
    }

}

// very unclear why (TS bug?) but connecting this doesn't discharge the type obligation for 'actions'
// so explicitly cast to what we're expecting
export const FollowsUserView = connect(mapStateToProps, mapDispatchToProps)(_FollowsUserView) as any as ConnectedComponentClass<typeof _FollowsUserView, FollowsUserViewBaseProps>;