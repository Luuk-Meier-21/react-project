// All data needed to run the app
export interface AppData {
    about?: any;
    project?: any;
}

// Data api will fetch
export interface ApiData {
    fulfilled: boolean;
    data: AppData;
}