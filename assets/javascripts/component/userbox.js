import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, p, button, makeDOMDriver} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
  return DOMSource.select('.toggle-follow').events('click')
    .map( ev => ev.target.getAttribute('data-follow') )
    .map( string => string === "true" );
}

function model(newValue$, props$) {
  const initialValue$ = props$.map( props => props.init ).first();
  const value$ = initialValue$.concat( newValue$ );
  return Rx.Observable.combineLatest( value$, props$, (value, props) => {
    return {
      following: props.following,
      followers: props.followers,
      description: props.description,
      isFollowed: !value,
      condition: value ? 'Unfollow' : 'Follow'
    };
  });
}

function view(state$) {
  return state$.map( state =>
    div('.user', [
     p('.following', `Following ${state.following}`),
     p('.followers', `Followers ${state.followers}`),
     p('.description', `${state.description}`),
     button('.toggle-follow', {'dataset': { 'follow': state.isFollowed }}, state.condition),
    ])
  );
}

function UserBox(sources) {
  const change$ = intent(sources.DOM);
  const state$ = model(change$, sources.props);
  const vtree$ = view(state$);
  return {
    DOM: vtree$,
    value: state$.map( state => state.isFollowed )
  };
}

const Component = sources => isolate(UserBox)(sources);

export { Component as UserBox };

