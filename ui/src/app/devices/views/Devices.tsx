import { Route, Switch } from "react-router-dom";

import DeviceDetails from "./DeviceDetails";
import DeviceList from "./DeviceList";

import NotFound from "app/base/views/NotFound";
import devicesURLs from "app/devices/urls";

const Devices = (): JSX.Element => {
  return (
    <Switch>
      <Route
        exact
        path={devicesURLs.devices.index}
        render={() => <DeviceList />}
      />
      {[
        devicesURLs.device.configuration(null, true),
        devicesURLs.device.index(null, true),
        devicesURLs.device.network(null, true),
        devicesURLs.device.summary(null, true),
      ].map((path) => (
        <Route exact key={path} path={path} render={() => <DeviceDetails />} />
      ))}
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Devices;
