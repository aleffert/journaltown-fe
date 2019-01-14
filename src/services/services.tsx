import React from 'react';

import { ApiService } from './api-service';
import { StorageService } from './storage-service';
import { Omit } from '../utils';

export class Services {
    api: ApiService
    storage: StorageService

    constructor() {
        this.storage = new StorageService();
        this.api = new ApiService(this.storage);
    }
};

export const services = new Services();
export const ServiceContext: React.Context<Services> = React.createContext(services);

export function withServices<P extends {services: Services}>(Wrapped: React.ComponentType<P>): React.ComponentType<Omit<P, 'services'>> {
    return ((props: any) => <ServiceContext.Consumer>
        { (services: Services) => <Wrapped {...props} services={services} ></Wrapped> }
      </ServiceContext.Consumer>
    );
}