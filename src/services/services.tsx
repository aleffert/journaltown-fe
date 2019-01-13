import React from 'react';

import { ApiService } from './api-service';
import { StorageService } from './storage-service';

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

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withServices<P extends {services: Services}>(Wrapped: React.ComponentType<P>): React.ComponentType<Omit<P, 'services'>> {
    return ((props: any) => <ServiceContext.Consumer>
        { (services: Services) => <Wrapped {...props} services={services} ></Wrapped> }
      </ServiceContext.Consumer>
    );
}