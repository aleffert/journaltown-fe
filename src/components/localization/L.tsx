import React from 'react';
import { LanguageContext, LocalizedString, Language } from '../../utils';
import { Omit } from '../../utils';

export type LanguageProps = {
    language: Language
}

export type LProps = {
    children: LocalizedString
}

export function L(props: LProps) {
    return <LanguageContext.Consumer>{language => props.children[language]}</LanguageContext.Consumer>
}

export const LC = LanguageContext.Consumer;


export function withLanguage<CProps extends LanguageProps, C extends React.ComponentClass<CProps>>(C: C) {
    const _C = C as any;
    return (props: Omit<CProps, 'language'>) => <LC>{(l: Language) => <_C language={l} {...props}/>}</LC>
}
