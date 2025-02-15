import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeleteForm from "./DeleteForm";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("DeleteForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("correctly runs function to delete given nodes", () => {
    const onSubmit = jest.fn();
    const nodes = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeleteForm
            clearHeaderContent={jest.fn()}
            modelName="machine"
            nodes={nodes}
            onSubmit={onSubmit}
            processingCount={0}
            redirectURL="www.url.com"
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper);

    expect(onSubmit).toHaveBeenCalledWith();
  });

  it("redirects when a node is deleted from details view", () => {
    const nodes = [machineFactory({ system_id: "abc123" })];
    const store = mockStore(state);
    const Proxy = ({ processingCount }: { processingCount: number }) => (
      <Provider store={store}>
        <MemoryRouter>
          <DeleteForm
            clearHeaderContent={jest.fn()}
            modelName="machine"
            nodes={nodes}
            onSubmit={jest.fn()}
            processingCount={processingCount}
            redirectURL="www.url.com"
            viewingDetails
          />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy processingCount={1} />);

    wrapper.setProps({ processingCount: 0 });
    wrapper.update();

    expect(wrapper.find("[data-testid='delete-redirect']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='delete-redirect']").prop("to")).toBe(
      "www.url.com"
    );
  });

  it("does not redirect from details view if there are errors", () => {
    const nodes = [machineFactory({ system_id: "abc123" })];
    const store = mockStore(state);
    const Proxy = ({
      errors,
      processingCount,
    }: {
      errors: string | null;
      processingCount: number;
    }) => (
      <Provider store={store}>
        <MemoryRouter>
          <DeleteForm
            clearHeaderContent={jest.fn()}
            errors={errors}
            modelName="machine"
            nodes={nodes}
            onSubmit={jest.fn()}
            processingCount={processingCount}
            redirectURL="www.url.com"
            viewingDetails
          />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy errors={null} processingCount={1} />);

    wrapper.setProps({ errors: "It didn't work", processingCount: 0 });
    wrapper.update();

    expect(wrapper.find("[data-testid='delete-redirect']").exists()).toBe(
      false
    );
  });
});
