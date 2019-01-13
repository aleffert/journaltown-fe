import React from 'react';
import { LanguageContext, LocalizedString } from '../utils';


export type LProps = {
    children: LocalizedString
}

export function L(props: LProps) {
    return <LanguageContext.Consumer>{language => props.children[language]}</LanguageContext.Consumer>
}

export const LC = LanguageContext.Consumer;