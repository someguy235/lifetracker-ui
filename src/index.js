import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/css/bootstrap-theme.css');

//require('bootstrap');
var _ = require('lodash');


/*
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}
*/

// function Square(props){
//   return (
//     <button className="square" onClick={props.onClick}>
//       {props.value}
//     </button>
//   );
// }

// class Board extends React.Component {
  
//   renderSquare(i) {
//     return (
//       <Square 
//         value={this.props.squares[i]}
//         onClick={() => this.props.onClick(i)} />
//     );
//   }

//   render() {
//     return (
//       <div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }

// class Game extends React.Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       history : [{
//         squares : Array(9).fill(null)
//       }],
//       stepNumber : 0,
//       xIsNext : true,
//     }
//   }

//   handleClick(i) {
//     //const history = this.state.history;
//     const history = this.state.history.slice(0, this.state.stepNumber + 1);
//     const current = history[history.length - 1];
//     const squares = current.squares.slice();
//     if(calculateWinner(squares) || squares[i]){
//       return;
//     }
//     squares[i] = this.state.xIsNext ? 'X' : 'O';
//     this.setState({
//       history : history.concat([{
//         squares : squares
//       }]),
//       stepNumber : history.length,
//       xIsNext : !this.state.xIsNext
//     });
//   }

//   jumpTo(step) {
//     this.setState({
//       stepNumber : step,
//       xIsNext : (step % 2) === 0,
//     })
//   }

//   render() {
//     const history = this.state.history;
//     const current = history[this.state.stepNumber];
//     const winner = calculateWinner(current.squares);

//     const moves = history.map((step, move) => {
//       const desc = move ? 
//         'Go to move # '+ move : 
//         'Go to game start';
//       return (
//         <li key={move}>
//           <button onClick={() => this.jumpTo(move)}>{desc}</button>
//         </li>
//       );
//     });

//     let status;
//     if(winner){
//       status = 'Winner: '+ winner;
//     } else {
//       status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//     }
    
//     return (
//       <div className="game">
//         <div className="game-board">
//           <Board 
//             squares = {current.squares}
//             onClick = {(i) => this.handleClick(i)} />
//         </div>
//         <div className="game-info">
//           <div>{status}</div>
//           <ol>{moves}</ol>
//         </div>
//       </div>
//     );
//   }
// }

class MainArea extends React.Component {
  constructor(props){
    super(props);
    this.state={
      metrics : {},
      isAuth : false,
      invalidAuth : false,
      authToken : '',
      username : ''
    }
  }

  setAuthState(isAuth){
    this.setState({isAuth : isAuth});
  }

  setAuthToken(authToken){
    this.setState({authToken : authToken});
  }

  setInvalidAuth(invalidAuth){
    this.setState({invalidAuth : invalidAuth});
  }

  setUsername(username){
    // console.log('setUsername: '+ username);
    this.setState({username : username});
  }

  addMetrics(metrics){
    // console.log("addMetrics");
    // console.log(metrics);
    const m = {};
    _.each(metrics, function(metric){
      metric.selected = false;
      metric.data = [];
      m[metric['name']] = metric;
    });
    this.setState({metrics : m});
  }

  updateMetric(name){
    // console.log("updateMetric: ");
    // console.log(name);
    
    // const metrics = this.state.metrics.slice();
    // const name = metric.name;
    // _.each(metrics, function(m){
    //   console.log(m);
    //   if(m.name === name){
    //     m.selected = !m.selected;
    //     m.data = metric.data;
    //   }
    // });
    const metrics = this.state.metrics;
    // console.log(metrics);
    const metric = metrics[name];
    // console.log(metric);
    metrics[name].selected = !metric.selected;
    
    if(metric.data.length === 0){
      getMetricData(name, this.state.username, this.state.authToken).then(response => {
        //this.props.addMetrics(newMetrics);
        console.log("gotResponse:");
        console.log(response);
        metrics[name].data = response[name];
        // console.log("metrics: ");
        // console.log(metrics);
        this.setState({ metrics : metrics });        
      });
    }else{
      this.setState({ metrics : metrics });      
    }

  }

  render(){
    const metrics = this.state.metrics;
    const isAuth = this.state.isAuth;
    const invalidAuth = this.state.invalidAuth;
    const authToken = this.state.authToken;
    const username = this.state.username;

    return(
      <div id="main-area">
        <div className="row">
          <div className="col-md-4 col-md-offset-8">
            <div id="header-area">
              <LoginArea 
                username = {username}
                isAuth = {isAuth}
                invalidAuth = {invalidAuth}
                authToken = {authToken}
                setAuthState = {(isAuth) => this.setAuthState(isAuth)}
                setAuthToken = {(authToken) => this.setAuthToken(authToken)}
                setInvalidAuth = {(invalidAuth) => this.setInvalidAuth(invalidAuth)}
                setUsername = {(username) => this.setUsername(username)}
                />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div id="options-area">
              <OptionsArea 
                isAuth = {isAuth}
                authToken = {authToken}
                username = {username}
                metrics = {metrics}
                addMetrics = {(metrics) => this.addMetrics(metrics)}
                updateMetric = {(metric) => this.updateMetric(metric)}
              />
            </div>
          </div>
          <div className="col-md-8">
            <div id="chart-area">
              <ChartArea 
                isAuth = {isAuth}
                metrics = {metrics}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class LoginArea extends React.Component {
  // this.props.username
  // this.props.setUsername(username);
  // this.props.isAuth
  // this.props.authToken
  // this.props.setAuthState(isAuth);

  constructor(props){
    super(props);
    this.state = {
      username: '', 
      password: ''
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // console.log(this);
  }

  componentWillMount(){
    // console.log("login component will mount");
    this.checkAuth();
  }

  checkAuth(){
    // console.log("checkAuth()");
    // console.log(this.props.isAuth);
    // console.log(this.props.authToken);
    if(this.props.authToken){
      checkAuthToken(this.props.authToken).then(function(isAuth){
        this.props.setAuthState(isAuth);
        if(!this.props.isAuth){
          this.props.setAuthToken(null);
        }
      }).catch(function(err){
        this.props.setAuthState(false);
        // console.log('error');
        // console.log(err);
        // return false;
      });
    }else{
      this.props.setAuthState(false);
    }
    // console.log(this.props.isAuth);
    // console.log(this.props.authToken);
  }

  handleSubmit(e){
    e.preventDefault();
    // console.log("handleSubmit()");
    getAuthToken(this.state.username, this.state.password).then(response => {
      // console.log(response);
      this.props.setUsername(this.state.username);
      this.props.setAuthToken(response);
      this.props.setAuthState(true);
      this.props.setInvalidAuth(false);
      // console.log(this.props.authToken);
    }).catch(function(error){
      this.props.setAuthToken(null);
      this.props.setAuthState(false);
      this.props.setInvalidAuth(true);
      console.log(error);
      //TODO
    }.bind(this)).then(() => {
      // console.log(this.props.username);
      // console.log(this.props.isAuth);
      // console.log(this.props.authToken);
    });
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }
  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }


  render(){
    return(
      this.props.isAuth ?
      <div>{this.props.username}</div> :
      this.props.invalidAuth ? 
      <div>invalid username/password</div> : 
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="username" value={this.state.username} onChange={this.handleUsernameChange} placeholder="username" />
          <input type="text" name="password" value={this.state.password} onChange={this.handlePasswordChange} placeholder="password" />
          <input type="submit" value="Login" />
        </form>
      </div>
    )
  }


}

class OptionsArea extends React.Component {
  // constructor(props){
    // super(props);
    // this.state = {
    //   metrics : {},
    // }
  // }

  // componentDidMount() {
    //this.getMetrics();
    // console.log("Options Area isAuth: "+ this.props.isAuth);
  // }

  componentWillReceiveProps(newProps){
    // console.log("Options Area newProps");
    // console.log("isAuth: "+ this.props.isAuth +"|"+ newProps.isAuth);
    // console.log(newProps);
    if(newProps.isAuth && !this.props.isAuth){
      this.getMetrics();
    }
  }

  getMetrics() {
    loadAvailableMetrics(this.props.username, this.props.authToken).then(newMetrics => {
      this.props.addMetrics(newMetrics);
    });
  }

  // getMetricData() {
  //   loadMetricData().then(metricData => {
  //     this.props.updateMetric(metricData);
  //   })
  // }

  render() {
    // console.log(this.props.metrics);

    // const activeMetricsList = this.props.metrics
    // .filter((metric) => {
    //   return metric.arch === null;
    // })
    // .map((metric) => {
    //   const name = metric.name;
    //   const desc = metric.desc;
    //   const unit = metric.unit;
    //   const type = metric.type;
    //   const dflt = metric.dflt;
    //   const arch = metric.arch;
    //const activeMetricsList = _.filter(this.props.metrics, function(m){return m.arch === null});
    const activeMetricsList = _(this.props.metrics)
    .filter(function(metric){ return metric.arch === null})
    .mapValues((function(metric){ 
      // console.log(metric);
      const name = metric.name;
      const desc = metric.desc;
      // const unit = metric.unit;
      // const type = metric.type;
      // const dflt = metric.dflt;
      // const arch = metric.arch;
      return(
        <li key={name}>
        <input id="metrics-list" type="checkbox" onClick={() => this.props.updateMetric(name)} />
          {name} {desc !== '' ? '('+ desc +')' : ''}
        </li>
      ); 
    }).bind(this))
    .values()
    .value();
    // console.log(activeMetricsList);
    // const archivedMetricsList = this.props.metrics
    // .filter((metric) => {
      // return metric.arch !== null;
    // })
    // .map((metric) => {

    const archivedMetricsList = _(this.props.metrics)
      .filter(function(metric){ return metric.arch !== null})
      .mapValues((function(metric){ 
      const name = metric.name;
      const desc = metric.desc;
      // const unit = metric.unit;
      // const type = metric.type;
      // const dflt = metric.dflt;
      // const arch = metric.arch;

      return(
        <li key={name}>
        <input id="metrics-list" type="checkbox" onClick={() => this.props.updateMetric(name)} />
          {name} {desc !== '' ? '('+ desc +')' : ''}
        </li>
      ); 
    }).bind(this))
    .values()
    .value();
    // console.log(archivedMetricsList);

    return (
      this.props.isAuth ? 

      <div className="options">
        {/* <div className="options-button">
          <button onClick={() => this.getMetrics()}>Load Metrics</button>
        </div> */}
        <div className="active-metrics-list">
          {activeMetricsList.length > 0 ? 'Active Metrics:' : 'No Active Metrics'}
          <ol>{activeMetricsList}</ol>
        </div>
        <div className="archived-metrics-list">
          {archivedMetricsList.length > 0 ? 'Archived Metrics:' : 'No Archived Metrics'}
          <ol>{archivedMetricsList}</ol>
        </div>
      </div>
      
      :

      <div className="options">Log in to see options</div> 
    );
  }


}

class ChartArea extends React.Component{
  // constructor(props){
    // super(props);
    // this.state = {
    //   data : {
    //     columns : []
    //   },
    // }
  // }
  // componentWillReceiveProps(newProps){
    // console.log("Chart Area newProps:");
    // console.log(newProps);
  // }

  render(){
    // console.log("chart render");
    const metrics = this.props.metrics;
    // console.log(metrics);
    const data = {
      x : 'x',
      // type : 'bar'
      // type : 'line'
      type : 'line'
      // columns : [
      //   ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
      //   ['data1', 30, 200, 100, 400, 150, 250],
      //   ['data2', 130, 340, 200, 500, 250, 350]
      // ]
    };

    const axis = {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d'
        }
      }
    };

    const columns = {};
    //let dates = ['x'];
    let dates = [];
    const selected = _.filter(metrics, function(metric){ return metric.selected });

    //TODO: prob shouldn't do this every time

    // get unique dates from all metrics
    _.each(selected, function(metric){
      columns[metric.name] = [];
      dates.push(_.keys(metric.data));
      //let column = [metric.name];
      // _.each(metric.data, function(value, date){
        // console.log(date);
        // console.log(value);
        //column.push(d.count);
        // dates.push(date);
      // });
      //console.log(column);
      //columns.push(column);
    });
    dates = _.union(...dates);

    // console.log(dates);

    _.each(dates, function(date){
      _.each(selected, function(metric){
        if(_.has(metric.data, date) && (metric.data[date] !== 0)){
          columns[metric.name].push(metric.data[date]);
        }else{
          // columns[metric.name].push(metric.dflt);
          columns[metric.name].push(null);
        }
      });
    });


    // _.each(selected, function(metric){
      // let column = [metric.name];
    // })

    dates.unshift('x');

    // console.log(dates);
    data.columns = [];
    data.columns.push(dates);

    _.each(columns, function(column, metric){
      column.unshift(metric);
      data.columns.push(column);
    })
    //data.columns = columns;
    // console.log(data);

    //this.setState({ data : data });

    // .mapValues((function(metric){ 
      // const name = metric.name;
      // const desc = metric.desc;
      // const unit = metric.unit;
      // const type = metric.type;
      // const dflt = metric.dflt;
      // const arch = metric.arch;

      // return(
        // 1
        // <li key={name}>
        // <input id="metrics-list" type="checkbox" onClick={(name) => this.props.updateMetric(name)} />
        //   {name} ({desc})
        // </li>
    //   ); 
    // }).bind(this))
    // .values()
    // .value();

    let options = {
      padding: {
        top: 20,
        bottom: 20,
        left: 40,
        right: 10
      },
      size: {
        // width: 800,
        height: 700
      },
      subchart: true,
      zoom: true,
      grid: {
        x: false,
        y: true
      },
      labels: true,
      axisLabel: {
        x: "product",
        y: "quantity"
      },
      onClick: function(d) {
        let categories = this.categories(); //c3 function, get categorical labels
        console.log(d);
        console.log("you clicked {" + d.name + ": " + categories[d.x] + ": " + d.value + "}");
      }
    };

    // let type = "bar" // {"line","bar","pie", "multiBar","lineBar"}
    // let type = "line";
    

    return(
      // <C3Chart data={data} type={type} axis={axis} options={options}/> 
      this.props.isAuth ?

      <C3Chart data={data} axis={axis} options={options}/> 

      :

      null
    )
  }
}

// ========================================
/*
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
*/
// ReactDOM.render(
//   <OptionsArea />,
//   document.getElementById('options-area') 
// );

// ReactDOM.render(
//   <ChartArea />,
//   document.getElementById('chart-area') 
// );

ReactDOM.render(
  <MainArea />,
  document.getElementById('main')
);

function loadAvailableMetrics(username, authToken){
  // console.log("called loadAvailableMetrics()");
  // console.log(username);
  // console.log(authToken);
  return new Promise((resolve, reject) => {
    fetch('/api/metrics?user='+username, {
      headers : {
        'x-access-token' : authToken,
        "Content-Type": "application/json"
      }

    }).then(function (response) {
      //return response.json();
      resolve(response.json());
    }).catch(function(error){
      console.log(error);
    })
    //.then(function (body) {
    //  console.log(body);
    //  //return body;
    //});
  })
}

function getMetricData(name, username, authToken){
  // console.log("getMetricData: "+ name);
  return new Promise((resolve, reject) => {
    //fetch('/data?metric='+ name).then(function(response){
    fetch('/api/data?metric='+ name + '&range=600&user='+ username, {
      headers : {
        'x-access-token' : authToken,
        "Content-Type": "application/json"
      }
    }).then(function(response){
      resolve(response.json());
    }).catch(function(error){
      console.log(error);
    })
  })
}

function getAuthToken(username, password){
  // console.log('getAuthToken');
  // console.log(username);
  // console.log(password);
  return new Promise((resolve, reject) => {
    fetch('http://localhost:8080/api/auth', {
      method : 'POST',
      body : JSON.stringify({
        username : username,
        password : password
      }),
      headers : {
        "Content-Type": "application/json"
      },
      mode : 'cors'
    }).then(function(response){
      if(response.status !== 200){
        reject(response.status);
      }else{
        console.log(response);
        response.json().then(function(data){
          // console.log(data);
          resolve(data.authtoken);
        });
      }
    }).catch(function(error){
      console.log(error);
    });
  });
}

function checkAuthToken(token){
  // console.log('checkAuthToken');
  // console.log(token);
  return new Promise((resolve, reject) => {
    fetch('http://localhost:8080/api/auth', {
      method : 'POST',
      body : JSON.stringify({
        token : token
      }),
      headers : {
        "Content-Type": "application/json"
      },
      mode : 'cors'
    }).then(function(response){
      if(response.status !== 200){
        reject(response.status);
      }else{
        response.json().then(function(data){
          // console.log(data);
          resolve(data);
        }).catch(function(error){
          console.log(error)
        });
      }
    }).catch(function(error){
      console.log(error);
    });
  });
}



// function calculateWinner(squares){
//   const lines = [
//     [0,1,2],
//     [3,4,5],
//     [6,7,8],
//     [0,3,6],
//     [1,4,7],
//     [2,5,8],
//     [0,4,8],
//     [2,4,6]
//   ];
//   for(let i=0; i < lines.length; i++){
//     const [a,b,c] = lines[i];
//     if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
//       return squares[a];
//     }
//   }
//   return null;
// }
