import React from 'react';

import { ApiService } from "./services/api-service";

export class Services {
    api: ApiService

    constructor() {
        this.api = new ApiService();
    }
};

export const ServiceContext: React.Context<Services> = React.createContext({} as Services);