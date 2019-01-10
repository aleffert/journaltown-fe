import React from 'react';
import { LocaleContext, LocalizedString } from '../utils';


export type LProps = {
    children: LocalizedString
}

export function L(props: LProps) {
    return <LocaleContext.Consumer>{locale => props.children[locale]}</LocaleContext.Consumer>
}

export const LC = LocaleContext.Consumer;