import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, h2, makeDOMDriver} from '@cycle/dom';
import { BMICalculator } from './component/bmicalculator';
import { UserBox } from './component/userbox';

function main(sources) {
  const bmiSinks = BMICalculator({DOM: sources.DOM});
  const bmiVTree$ = bmiSinks.DOM;

  const userProps$ = Rx.Observable.of({
    following: 400,
    followers: 600,
    description: 'My name is Ian',
    isFollowed: 1
  });

  const userSinks = UserBox({DOM: sources.DOM, props: userProps$});
  const userVTree$ = userSinks.DOM;

  const vtree$ = Rx.Observable.combineLatest( bmiVTree$, userVTree$,
    (bmiVTree, userVTree) =>
      div([
        bmiVTree,
        userVTree
     ])
    );

  return {
    DOM: vtree$
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
};

Cycle.run(main, drivers);
