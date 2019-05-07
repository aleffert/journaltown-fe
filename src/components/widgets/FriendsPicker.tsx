import React from 'react';
import { Header, List, Icon } from 'semantic-ui-react';

type FriendsPickerProps = {
    allFriends: string[],
    selectedFriends: string[],
    onSelectedFriends:(usernames: string[]) => void
};

function addToSelection(selectedFriends: string[], friend: string) {
    return new Array(...new Set(selectedFriends).add(friend)).sort();
}

function removeFromSelection(selectedFriends: string[], friend: string) {
    const result = new Set(selectedFriends);
    result.delete(friend);
    return new Array(...result);
}

function getUnselectedFriends(allFriends: string[], selectedFriends: string[]) {
    const result = new Set(allFriends);
    for(const u of selectedFriends) {
        result.delete(u);
    }
    return new Array(...result);
}

export function FriendsPicker(props: FriendsPickerProps) {

    const unselectedFriends = getUnselectedFriends(props.allFriends, props.selectedFriends);

    return <div>
        <Header as="h2">Group Members</Header>
        <List horizontal bulleted>{props.selectedFriends.map(f =>
            <List.Item key={f}>
                <button onClick={() => props.onSelectedFriends(removeFromSelection(props.selectedFriends, f))}>
                <Icon name="minus"/> {f}
                </button>
            </List.Item>)}
        </List>
        <Header as="h2">Possible Group Members</Header>
        <List horizontal bulleted>{unselectedFriends.map(f =>
            <List.Item key={f}>
                <button onClick={() => props.onSelectedFriends(addToSelection(props.selectedFriends, f))}>
                <Icon name="plus"/> {f}
                </button>
            </List.Item>)}
        </List>
    </div>
}