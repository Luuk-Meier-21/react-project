
interface ApiQueries {
  about: string;
  [queryName: string]: string;
}

export default class Api {
  static url = 'https://api-eu-central-1.graphcms.com/v2/cknj41e0xkh2r01z03fqlbdmb/master?operationName=About&query=query%20About%20%7B%0A%20%20about(where%3A%20%7Bid%3A%20%22cknkdtm801j390c99ol1ov8nk%22%7D)%20%7B%0A%20%20%20%20name%0A%20%20%20%20profile%20%7B%0A%20%20%20%20%20%20url%0A%20%20%20%20%7D%0A%20%20%20%20contacts%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20url%0A%20%20%20%20%7D%0A%20%20%20%20bio%20%7B%0A%20%20%20%20%20%20html%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A';

  static path = 'https://api-eu-central-1.graphcms.com/v2/cknj41e0xkh2r01z03fqlbdmb/master?operationName=About&query=';
  // static about = encodeURIComponent();
  static queries: ApiQueries = {
    about: `
    query About {
        about(where: {id: "cknkdtm801j390c99ol1ov8nk"}) {
          name
          profile {
            url
          }
          contacts {
            name
            url
          }
          bio {
            html
          }
        }
      }
    `
  }

  static getPath(queryName: string = '') {
    if (this.queries[queryName]) {
      return this.path + encodeURIComponent(this.queries[queryName]).replace(/(%20)/g, '').replace(/(%7B%0A%)/g, '');
    } else {
      throw Error(`"${queryName}" query could not resolve`)
    }
  }
}

