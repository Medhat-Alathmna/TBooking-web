// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export var clientName='local'
export interface ClientConfig {
  apiUrl: string;
  logoUrl: string;
  imgUrl?: string;
}

const clientConfigs: { [key: string]: ClientConfig } = {
  LBC: {
    apiUrl: "https://lobster-app-ua5mr.ondigitalocean.app/api",
    logoUrl: "assets/logos/client1.png",
  },
  Demo: {
    apiUrl: "https://octopus-app-9koya.ondigitalocean.app/api",
    logoUrl: "assets/logos/client2.png",
  },
  local: {
    apiUrl: "http://localhost:1337/api",
    imgUrl: "http://localhost:1337",
    logoUrl: "assets/logos/client2.png",
  },
};

export function getLocalConfig(clientName: string): ClientConfig {
  return clientConfigs[clientName] || clientConfigs['Demo'];
}
export const environment = {
  production: false,
  apiUrl: getLocalConfig(clientName).apiUrl,
  imgUrl:getLocalConfig(clientName).imgUrl,

};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


