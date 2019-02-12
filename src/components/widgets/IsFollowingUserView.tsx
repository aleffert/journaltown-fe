import React from 'react';

type IsFollowingUserViewProps = {
    following: boolean,
    username: string
};

export class IsFollowingUserView extends React.Component<IsFollowingUserViewProps> {
    render() {
        if(this.props.following) {
            return "Is following you";
        }
        else {
            return "Does not follow you";
        }
    }
}