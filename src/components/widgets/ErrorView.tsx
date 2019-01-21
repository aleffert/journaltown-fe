import React from 'react';
import { LocalizedString, Optional } from "../../utils";
import { SemanticICONS, Icon, Grid } from "semantic-ui-react";
import { L } from "../localization/L";
import { ApiError } from "../../services";
import strings from "../../strings";
import { FullScreen } from './FullScreen';

type ErrorViewProps = {
    message: LocalizedString,
    icon?: SemanticICONS
};

export function ErrorView(props: ErrorViewProps) {
    return (
        <FullScreen>
            <Grid relaxed textAlign="center" verticalAlign="middle">
            {props.icon ? <Grid.Row><Icon size="massive" name={props.icon}/></Grid.Row> : null}
            <Grid.Row><L>{props.message}</L></Grid.Row>
        </Grid></FullScreen>
    );
}

type ApiErrorViewProps = {
    error: ApiError
};
export function ApiErrorView(props: ApiErrorViewProps) {
    let message: LocalizedString = strings.errors.unknown;
    let icon: Optional<SemanticICONS> = undefined;
    switch(props.error.type) {
        case 'not-found':
            message = strings.errors.notFound;
            icon = 'question';
            break;
        case 'connection':
            message = strings.errors.connectionError;
            icon = 'wifi';
            break;
    }
    return <ErrorView message={message} icon={icon} />
}