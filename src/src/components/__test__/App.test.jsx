import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});

import TestPlannerPID from "./TestPlannerPID";
import SelectApi from "../api/SelectApi";
import ParametersPID from "../api/ParametersPID";
import TransportPID from "../api/TransportPID";
import AccessibilityPID from "../api/AccessibilityPID";


describe('Testování sestavení stránky: Existence prvků', () => {

  it('Stránka by měla obsahovat hlavní zadávací pole Odkud', () => {
    const pid = mount(<TestPlannerPID></TestPlannerPID>);
    expect(pid.find('input#input_from').length).toBe(1)
  });

  it('Stránka by měla obsahovat hlavní zadávací pole Přes', () => {
    const pid = mount(<TestPlannerPID></TestPlannerPID>);
    expect(pid.find('input#input_via').length).toBe(1)
  });

  it('Stránka by měla obsahovat hlavní zadávací pole Kam', () => {
    const pid = mount(<TestPlannerPID></TestPlannerPID>);
    expect(pid.find('input#input_to').length).toBe(1)
  });

  it('Stránka by měla obsahovat selektor API', () => {
    const pid = mount(<TestPlannerPID></TestPlannerPID>);
    expect(pid.find(SelectApi).length).toBe(1);
  });

  it('Stránka by měla obsahovat hlavní parametry', () => {
    const pid = mount(<TestPlannerPID></TestPlannerPID>);
    expect(pid.find(ParametersPID).length).toBe(1);
  });

  it('Stránka by měla obsahovat parametry dopravy', () => {
    const pid = mount(<TestPlannerPID></TestPlannerPID>);
    expect(pid.find(TransportPID).length).toBe(1);
  });

  it('Stránka by měla obsahovat nastavení přístupnosti', () => {
    const pid = mount(<TestPlannerPID></TestPlannerPID>);
    expect(pid.find(AccessibilityPID).length).toBe(1);
  });
});