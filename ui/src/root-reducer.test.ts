import type { History } from "history";

import createRootReducer from "./root-reducer";

import {
  authState as authStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  statusState as statusStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

describe("rootReducer", () => {
  it(`should reset app to initial state on LOGOUT_SUCCESS, except status which
    resets to authenticating = false`, () => {
    const initialState = rootStateFactory({
      status: statusStateFactory({ authenticating: true }),
    });
    const newState = createRootReducer({} as History)(initialState, {
      type: "status/logoutSuccess",
    });

    expect(newState.status.authenticating).toBe(false);
    expect(newState).toMatchSnapshot();
  });

  it("it should clear the state when disconnected from the websocket", () => {
    const authUser = userFactory({ id: 1 });
    const initialState = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({ id: 1 }),
          machineFactory({ id: 2 }),
          machineFactory({ id: 3 }),
        ],
      }),
      status: statusStateFactory({ authenticating: true }),
      user: userStateFactory({
        items: [authUser, userFactory({ id: 2 }), userFactory({ id: 3 })],
        auth: authStateFactory({
          user: authUser,
        }),
      }),
    });
    const newState = createRootReducer({} as History)(initialState, {
      type: "status/websocketDisconnected",
    });

    expect(newState.machine.items.length).toBe(0);
    expect(newState.status.authenticating).toBe(true);
    expect(newState.user.items.length).toBe(0);
    expect(newState.user.auth.user).toBe(authUser);
  });
});
