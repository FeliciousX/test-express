import Rx from 'rx';
import {div, makeDOMDriver} from '@cycle/dom';
import { UserBox } from './userbox';

function intent( HTTPSource, URL ) {
  return HTTPSource.filter( res$ => res$.request.url.indexOf( URL ) === 0 )
    .flatMap( x => x )
    .map( res => res.body );
}

function model( newValue$ ) {
  return newValue$.map( users => users.map(
    user => Rx.Observable.of({
      name: user.name,
      following: user.following,
      followers: user.followers,
      description: user.about,
      isFollowed: user.isActive
    })
    )
  );
}

function view( state$, DOMSource ) {
  return state$.map( state =>
    div('.user-list',
      state.map( user$ => UserBox({DOM: DOMSource, props: user$}).DOM )
    )
  );
}

function UserList( sources, URL ) {
  const change$ = intent( sources.HTTP, URL );
  const state$ = model( change$ );
  const vtree$ = view( state$, sources.DOM );

  return {
    DOM: vtree$
  };
}

export { UserList };
