export var clientName = 'Demo'


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
    apiUrl: "https://proud-heart-568cfbae9a.strapiapp.com/api",
    imgUrl: "https://proud-heart-568cfbae9a.strapiapp.com",
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