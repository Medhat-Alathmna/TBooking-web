const clientName = 'Demo'


export interface ClientConfig {
  apiUrl: string;
  imgUrl: string;
  logoUrl: string;
}

const clientConfigs: { [key: string]: ClientConfig } = {
  LBC: {
    apiUrl: "https://lobster-app-ua5mr.ondigitalocean.app/api",
    imgUrl: "https://lobster-app-ua5mr.ondigitalocean.app",
    logoUrl: "assets/logos/client1.png",
  },
  Demo: {
    apiUrl: "https://orca-app-n5847.ondigitalocean.app/api",
    imgUrl: "https://orca-app-n5847.ondigitalocean.app",
    logoUrl: "assets/logos/client2.png",
  },
};

export function getClientConfig(clientName: string): ClientConfig {
  return clientConfigs[clientName] || clientConfigs['Demo'];
}
export const environment = {
  production: true,
  apiUrl: getClientConfig(clientName).apiUrl,
  imgUrl: getClientConfig(clientName).imgUrl,

};