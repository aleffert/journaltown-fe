import React from 'react';
import { Button } from 'semantic-ui-react';
import { isLoading, pick, bindDispatch, Optional } from '../../utils';
import { AppState, actions } from '../../store';
import { connect, ConnectedComponentClass } from 'react-redux';
import strings from '../../strings';
import { L } from '../localization/L';

const mapStateToProps = (state: AppState) => pick(state, ['follows']);
const mapDispatchToProps = bindDispatch(pick(actions, ['follows']));

type FollowsUserViewStateProps = ReturnType<typeof mapStateToProps>;
type FollowsUserViewDispatchProps = ReturnType<typeof mapDispatchToProps>;
type FollowsUserViewBaseProps = {
    targetUsername: string
    currentUsername: Optional<string>
};

type FollowsUserViewProps = FollowsUserViewBaseProps & FollowsUserViewStateProps & FollowsUserViewDispatchProps

export class _FollowsUserView extends React.Component<FollowsUserViewProps> {

    constructor(props: FollowsUserViewProps) {
        super(props);
        this.onToggleFollow = this.onToggleFollow.bind(this);
    }

    loadUser() {
        if(this.props.currentUsername) {
            this.props.actions.follows.loadUserFollowing({
                currentUsername: this.props.currentUsername, username: this.props.targetUsername
            });
        }
    }

    componentDidMount() {
        this.loadUser();
    }

    componentDidUpdate(prevProps: FollowsUserViewProps) {
        if (this.props.targetUsername !== prevProps.targetUsername) {
          this.loadUser();
        }
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
        if(this.props.currentUsername) {
            const currentUsername = this.props.currentUsername;
            const targetUsername = this.props.targetUsername;
            const follows = this.props.follows.values[targetUsername] || false;
            const loading = isLoading(this.props.follows.results[targetUsername]);
            const text = follows ? strings.user.follows.unfollow : strings.user.follows.follow;
            const onToggleFollow = () => this.onToggleFollow(
                !follows, currentUsername, targetUsername
            );
            return <Button className="follow-toggle-button" secondary={true} loading={loading} onClick={onToggleFollow}><L>{text}</L> </Button>
        }
        else {
            return null;
        }
    }

}

// very unclear why (TS bug?) but connecting this doesn't discharge the type obligation for 'actions'
// so explicitly cast to what we're expecting
export const FollowsUserView = connect(mapStateToProps, mapDispatchToProps)(_FollowsUserView) as any as ConnectedComponentClass<typeof _FollowsUserView, FollowsUserViewBaseProps>;