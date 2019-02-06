import React from 'react';
import { AppState, actions } from '../../store';
import { bindDispatch, pick, isSuccess } from '../../utils';
import { connect } from 'react-redux';
import { List } from 'semantic-ui-react';
import { renderNavigationPath } from '../../store/navigation';
import { Link } from 'react-router-dom';

const mapStateToProps = (state: AppState) => pick(state, ['user']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user']));

type HomePageStateProps = ReturnType<typeof mapStateToProps>;
type HomePageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type HomePageProps = HomePageStateProps & HomePageDispatchProps;

class _HomePage extends React.Component<HomePageProps> {
    render() {
        if(isSuccess(this.props.user.currentUserResult)) {
            const currentUser = this.props.user.currentUserResult.value;
            return <List>
                <List.Item>
                    <Link to={renderNavigationPath({type: 'view-feed', username: currentUser.username})}>See friends posts</Link>
                    <Link to={renderNavigationPath({type: 'view-feed', username: currentUser.username})}>See your posts</Link>
                </List.Item>
            </List>
        }
        else {
            return null;
        }
    }
}

export const HomePage = connect(mapStateToProps, mapDispatchToProps)(_HomePage);