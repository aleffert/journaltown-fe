import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Language } from '../../utils';
import { withLanguage } from '../localization/L';
import strings from '../../strings';
import { FriendsPicker } from '../widgets/FriendsPicker';

type EditGroupFormProps = {
    language: Language,
    name: string,
    allFriends: string[],
    selectedFriends: string[],
    onNameChange: (name: string) => void,
    onSelectedFriends: (usernames: string[]) => void,
    onSubmit: () => void
};

function _EditGroupForm(props: EditGroupFormProps) {
    return <Form>
        <label htmlFor="name-field">Name</label>
        <Form.Input size="large" id='name-field'
            value={props.name}
            placeholder={strings.groups.form.placeholders.name[props.language]}
            onChange={e => props.onNameChange(e.target.value)}
        />
        <label htmlFor="members-field">Members</label>
        <FriendsPicker allFriends={props.allFriends} selectedFriends={props.selectedFriends} onSelectedFriends={props.onSelectedFriends}/>
        <Button primary onClick={props.onSubmit}>Create</Button>
    </Form>;
}

export const EditGroupForm = withLanguage<EditGroupFormProps, typeof _EditGroupForm>(_EditGroupForm);