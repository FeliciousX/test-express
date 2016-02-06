import Rx from 'rx';
import {div, h2, hr, p, button, makeDOMDriver} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
  return DOMSource.select('.toggle-follow').events('click')
    .map( ev => ev.target.getAttribute('data-follow') )
    .map( string => string === "true" );
}

function model(newValue$, props$) {
  const initialValue$ = props$.map( props => props.init ).first();
  const value$ = initialValue$.concat( newValue$ );
  return Rx.Observable.combineLatest( value$, props$, (value, props) => ({
      name: props.name,
      following: props.following,
      followers: props.followers,
      description: props.description,
      isFollowed: !value,
      condition: value ? 'Following' : 'Follow',
    })
  );
}

function view(state$) {
  return state$.map( state =>
    div('.user', [
      h2( state.name ),
      p(`Following ${state.following}`),
      p(`Followers ${state.followers}`),
      p('.description', `${state.description}`),
      button(`.toggle-follow.${state.condition.toLowerCase()}`, {'dataset': { 'follow': state.isFollowed }}, state.condition),
      hr()
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

