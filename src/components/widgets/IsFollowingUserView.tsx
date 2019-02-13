import React from 'react';
import strings from '../../strings';
import { L } from '../localization/L';

type IsFollowingUserViewProps = {
    following: boolean,
    username: string
};

export class IsFollowingUserView extends React.Component<IsFollowingUserViewProps> {
    render() {
        if(this.props.following) {
            return <L>{strings.user.follows.followsYou}</L>
        }
        else {
            return <L>{strings.user.follows.doesNotFollowYou}</L>
        }
    }
}