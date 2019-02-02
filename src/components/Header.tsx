import React from 'react';
import { Menu, Button, Dropdown, DropdownItemProps } from 'semantic-ui-react';
import { CurrentUser } from '../services/api/models';
import strings from '../strings';
import { L, withLanguage } from './localization/L';
import { Language } from '../utils';

type HeaderProps = {
    user: CurrentUser,
    onLogout: () => void,
    onPost: () => void,
    onProfile: (username: string) => void,
    language: Language
};

export class _Header extends React.Component<HeaderProps> {

    render() {
        return <Menu borderless fixed='top'>
            <Menu.Item><Button primary onClick={this.props.onPost}><L>{strings.header.post}</L></Button></Menu.Item>
            <Menu.Item position='right'>
                <Dropdown inline text={this.props.user.username}>
                    <Dropdown.Menu direction='left'>
                        <Dropdown.Item
                            text={strings.header.profile[this.props.language]}
                            onClick={() => this.props.onProfile(this.props.user.username)}
                        />
                        <Dropdown.Item
                            text={strings.header.logout[this.props.language]}
                            onClick={this.props.onLogout}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        </Menu>
    }
}

export const Header = withLanguage<HeaderProps, typeof _Header>(_Header);