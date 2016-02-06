import Rx from 'rx';
import {div, h2, makeDOMDriver} from '@cycle/dom';
import isolate from '@cycle/isolate';
import { LabeledSlider } from './labeledslider';

function calculateBMI( weight, height ) {
  const heightMetres = height * 0.01;
  const bmi = Math.round(weight / (heightMetres * heightMetres));
  return bmi;
}

function BMICalculator(sources) {
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
    DOM: vtree$,
    value: bmi$
  };
}

const Component = sources => isolate(BMICalculator)(sources);

export { Component as BMICalculator };
