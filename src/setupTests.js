/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "babel-polyfill";
import "@testing-library/jest-dom";

Enzyme.configure({ adapter: new Adapter() });
