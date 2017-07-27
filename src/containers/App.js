import PropTypes from 'prop-types'
import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom'
import * as Routes from './routes/Routes';

// import asyncComponent from 'helpers/async-component';

// const Home = asyncComponent(() =>
//   System.import('./routes/Home').then(module => module.default)
// );
// const Foo = asyncComponent(() =>
//   System.import('./routes/Foo').then(module => module.default)
// );
// const Bar = asyncComponent(() =>
//   System.import('./routes/Bar').then(module => module.default)
// );

const Status = ({ code, children }) => (
  <Route render={({ staticContext }) => {
    if (staticContext)
      staticContext.status = code
    return children
  }}/>
)

const NotFound = ({location}) => (
  <Status code={404}>
    <div>
      <h1>Sorry, can’t find that. No match for <code> {location.pathname} </code></h1>
    </div>
  </Status>
)

class App extends Component {
    constructor(props, context) {
        super(props, context)
        console.log("Props: ", props)
        console.log("Context: ", context)
        console.log("Context.router.route: ", context.router.route)
    }
    render() {
        return (
            <div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/foo">Foo</Link></li>
                    <li><Link to="/bar">Bar</Link></li>
                </ul>
                <hr />
                <Switch>
                    <Route exact path="/" component={Routes.Home} />
                    <Route path="/foo" component={Routes.Foo} />
                    <Route path="/bar" component={Routes.Bar} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        );
    }
}

App.contextTypes = {
  router: PropTypes.object
};

export default App;

/*
                <Match exactly pattern="/" component={Routes.Home} />
                <Match exactly pattern="/foo" component={Routes.Foo} />
                <Match exactly pattern="/bar" component={Router.Bar} />

*/