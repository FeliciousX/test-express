import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, h2, makeDOMDriver} from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { UserBox } from './component/userbox';

function main(sources) {
  const IG_USER_API = 'http://localhost:3001/users';
  const userRequest$ = Rx.Observable.of( IG_USER_API );

  const user$ = sources.HTTP
    .filter( res$ => res$.request.url.indexOf( IG_USER_API ) === 0 )
    .flatMap( x => x )
    .map( res => res.body )
    .startWith([])
    .map( results =>
      div([
        results.map( user => Rx.Observable.of({
            name: user.name,
            following: user.following,
            followers: user.followers,
            description: user.about,
            isFollowed: user.isActive
          })
        ).map( userProp$ => UserBox({DOM: sources.DOM, props: userProp$}).DOM )
      ])
    );

  return {
    DOM: user$,
    HTTP: userRequest$,
    log: user$
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  log: msg$ => { msg$.subscribe( msg => console.log(msg) ) }
};

Cycle.run(main, drivers);
