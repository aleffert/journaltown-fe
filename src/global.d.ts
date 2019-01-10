
declare global {
    interface EnvironmentVariables {

    }
    interface ProcessType {
        env: EnvironmentVariables;
    };

    const process : ProcessType;
}

export {};