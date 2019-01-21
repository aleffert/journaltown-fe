import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { CurrentUser } from '../services/api/models';
import strings from '../strings';
import { L } from './localization/L';

type HeaderProps = {
    user: CurrentUser
    onLogout: () => void
    onPost: () => void
};

export class Header extends React.Component<HeaderProps> {

    render() {
        return <Menu borderless fixed='top'>
                <Menu.Item><Button primary onClick={this.props.onPost}><L>{strings.header.post}</L></Button></Menu.Item>
                <Menu.Menu position='right'>
                <Menu.Item>
                    {this.props.user.username}
                </Menu.Item>
                <Menu.Item>
                        <Button secondary onClick={this.props.onLogout}>
                            <L>{strings.header.logout}</L>
                        </Button>
                </Menu.Item></Menu.Menu>
        </Menu>
    }
}