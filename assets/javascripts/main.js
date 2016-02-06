import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, h2, makeDOMDriver} from '@cycle/dom';
import { LabeledSlider } from './component/labeledslider';

function calculateBMI( weight, height ) {
  const heightMetres = height * 0.01;
  const bmi = Math.round(weight / (heightMetres * heightMetres));
  return bmi;
}

function main(sources) {
  const weightProps$ = Rx.Observable.of({
    label: 'Weight',
    unit: 'kg',
    min: 70,
    max: 200,
    init: 120
  });

  const weightSinks = LabeledSlider({DOM: sources.DOM, props: weightProps$});
  const weightVTree$ = weightSinks.DOM;
  const weightValue$ = weightSinks.value;

  const heightProps$ = Rx.Observable.of({
    label: 'Height',
    unit: 'cm',
    min: 120,
    max: 250,
    init: 170
  });

  const heightSinks = LabeledSlider({DOM: sources.DOM, props: heightProps$});
  const heightVTree$ = heightSinks.DOM;
  const heightValue$ = heightSinks.value;

  const bmi$ = Rx.Observable.combineLatest( weightValue$, heightValue$, calculateBMI );

  const vtree$ = Rx.Observable.combineLatest( bmi$, weightVTree$, heightVTree$,
    (bmi, weightVTree, heightVTree) =>
      div([
        weightVTree,
        heightVTree,
        h2(`BMI is ${bmi}`)
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
