import React from 'react';
import { Post } from '../../services/api/models';
import { Container, Header, Grid, Modal, Button } from 'semantic-ui-react';
import { PostActions } from './PostActions';
import { CurrentUserResult } from '../../services/api/requests';
import { Async } from '../../utils';
import { canEditPost } from './feed-helpers';
import strings from '../../strings';
import { L } from '../localization/L';

type FeedPostProps = {
    post: Post,
    currentUser: Async<CurrentUserResult>,
    onDelete: () => void
};

type FeedPostState = {
    deleting: boolean
}

export class FeedPost extends React.Component<FeedPostProps, FeedPostState> {

    constructor(props: FeedPostProps) {
        super(props);
        this.state = {
            deleting: false
        };

        this.onDelete = this.onDelete.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
        this.onCancelDelete = this.onCancelDelete.bind(this);
    }

    onDelete() {
        this.setState({deleting: true});
    }

    onConfirmDelete() {
        this.props.onDelete();
    }

    onCancelDelete() {
        this.setState({deleting: false});
    }

    render() {
        const canEdit = canEditPost(this.props.post, this.props.currentUser);
        return <Container>
            <Modal id="delete-modal" size='small' open={this.state.deleting} onClose={this.onCancelDelete}>
                <Modal.Header><L>{strings.post.delete.header}</L></Modal.Header>
                <Modal.Content>
                    <p><L>{strings.post.delete.prompt}</L></p>
                </Modal.Content>
                <Modal.Actions>
                <Button onClick={this.onCancelDelete}>
                    <L>{strings.common.cancel}</L>
                </Button>
                <Button negative onClick={this.onConfirmDelete} >
                    <L>{strings.common.delete}</L>
                </Button>
                </Modal.Actions>
            </Modal>
            <Grid>
                <Grid.Row>
                    <Header>{this.props.post.title}</Header>
                </Grid.Row>
                <Grid.Row>
                    {this.props.post.body}
                </Grid.Row>
                <Grid.Row>
                    <PostActions post={this.props.post} canEdit={canEdit} onDelete={this.onDelete}/>
                </Grid.Row>
            </Grid>
        </Container>;
    }
}