import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Feed, FeedProps } from './Feed';
import { connect } from 'react-redux';
import { AppState, actions } from '../../store';
import { bindDispatch, pick, Omit } from '../../utils';
import { Link } from 'react-router-dom';
import { renderNavigationPath } from '../../store/navigation';
import { Grid, Container, Header } from 'semantic-ui-react';

const mapStateToProps = (state: AppState) => pick(state, ['feed', 'user']);
const mapDispatchToProps = bindDispatch(pick(actions, ['feed', 'history', 'delete']));

export function _UserPostsPage(props: Omit<FeedProps, 'filters'> & RouteComponentProps<{username: string}>) {
    const username = props.match.params.username;
    const filters = {username};
    return (
        <Grid>
            <Grid.Row>
                <Grid>
                    <Grid.Row>
                        <Container>
                            <Header><Link to={renderNavigationPath({type: 'view-profile', username})}>{username}</Link></Header>
                        </Container>
                    </Grid.Row>
                </Grid>
            </Grid.Row>
            <Grid.Row>
                <Feed {...props} filters={filters}/>
            </Grid.Row>
        </Grid>
    );
}

export const UserPostsPage = connect(mapStateToProps, mapDispatchToProps)(_UserPostsPage);