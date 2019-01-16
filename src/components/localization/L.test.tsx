import React from 'react';
import { render } from 'enzyme';

import { L } from "./L";
import { LanguageContext } from "../../utils";

describe('L', () => {
    it('renders english', () => {
        const w = render(
            <div>
                <LanguageContext.Provider value="en">
                    <L>{{en: 'test', es: 'testo'}}</L>
                </LanguageContext.Provider>
            </div>
        );
        expect(w.text()).toEqual('test');
    });

    it('renders spanish', () => {
        const w = render(
            <div>
                <LanguageContext.Provider value="es">
                    <L>{{en: 'test', es: 'testo'}}</L>
                </LanguageContext.Provider>
            </div>
        );
        expect(w.text()).toEqual('testo');
    });
});