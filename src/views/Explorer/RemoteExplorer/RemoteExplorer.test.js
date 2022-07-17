import React from "react";
import { shallow } from "enzyme";
import { testStore } from "../../../../Utils";
import RemoteExplorer from "./RemoteExplorer";
import toJson from "enzyme-to-json";
import {
  TEST_FILE_CONTAINER_ID,
  TEST_REDUX_PROPS,
} from "../../../utils/testData";

const setUp = (intialState = {}, props = {}) => {
  const store = testStore(intialState);
  const component = shallow(<RemoteExplorer {...props} store={store} />);
  return component.childAt(0).dive();
};

describe("Remote Explorer", function () {
  describe("renders", function () {
    let wrapper;
    beforeEach(() => {
      const initialState = {
        ...TEST_REDUX_PROPS,
      };

      const props = {
        containerID: TEST_FILE_CONTAINER_ID,
        createPath: jest.fn(),
        distractionFreeMode: false,
      };
      wrapper = setUp(initialState, props);
    });

    it("should render without crashing", function () {
      expect(wrapper).toHaveLength(1);
    });

    it("should match snapshot", function () {
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
