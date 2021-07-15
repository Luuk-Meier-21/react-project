import React from 'react';
import * as Base from './components/base.component';
import * as Util from './components/util.component';
import * as Models from './models/base.models';


export default class App extends React.Component<{}, {
  data: Models.ApiData
}> {
  constructor(props: {}) {
    super(props);
    this.state = {
        data: {
          fulfilled: false,
          about: {}
        }
    };
}
 
  componentDidMount() {
    const url = 'https://api-eu-central-1.graphcms.com/v2/cknj41e0xkh2r01z03fqlbdmb/master?operationName=About&query=query%20About%20%7B%0A%20%20about(where%3A%20%7Bid%3A%20%22cknkdtm801j390c99ol1ov8nk%22%7D)%20%7B%0A%20%20%20%20name%0A%20%20%20%20profile%20%7B%0A%20%20%20%20%20%20url%0A%20%20%20%20%7D%0A%20%20%20%20contacts%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20url%0A%20%20%20%20%7D%0A%20%20%20%20bio%20%7B%0A%20%20%20%20%20%20html%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A';
    const http = new Util.Http<{about: any}>(url);
    http.promise.then((a) => {
      this.setState({
        data: {
          fulfilled: http.fulfilled,
          about: a.about
        }
      });
    })
  }

  // fetchData(): Util.Http<any> {
    
  // }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        {/* {this.state.data.about.name} */}
      </div>
    );
  }
}

export class Test extends Base.Component {
  data: Array<string> = ['hey', '2', 'No'];
  test: string = 'hi there';

  render() {
    return (      
      <div className="App">
        {this.data.map((value: any, index: number) => 
          <li key={index}>{value}</li>
        )}
      </div> 
    ); 
  }
}



