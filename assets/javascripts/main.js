import Rx from 'rx';
import Cycle from '@cycle/core';
import { makeDOMDriver} from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { UserList } from './component/userlist';


function main( sources ) {
  const IG_USER_API = 'http://localhost:3001/users';
  const userListSink = UserList( sources, IG_USER_API );
  const vtree$ = userListSink.DOM;

  return {
    DOM: vtree$,
    HTTP: Rx.Observable.of({
      url: IG_USER_API,
      method: 'GET',
      type: 'json'
    })
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
};

Cycle.run(main, drivers);
