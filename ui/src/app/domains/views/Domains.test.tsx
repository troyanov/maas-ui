import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Domains from "./Domains";

import domainsURLs from "app/domains/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Domains", () => {
  [
    {
      component: "DomainsList",
      path: domainsURLs.domains,
    },
    {
      component: "DomainDetails",
      path: domainsURLs.details({ id: 1 }),
    },
    {
      component: "NotFound",
      path: "/not/a/path",
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(rootStateFactory());
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <Domains />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
