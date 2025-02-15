import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import SectionHeader from "app/base/components/SectionHeader";
import type { SetSearchFilter } from "app/base/types";
import DeviceHeaderForms from "app/devices/components/DeviceHeaderForms";
import { DeviceHeaderViews } from "app/devices/constants";
import type {
  DeviceHeaderContent,
  DeviceSetHeaderContent,
} from "app/devices/types";
import { getHeaderTitle } from "app/devices/utils";
import deviceSelectors from "app/store/device/selectors";

type Props = {
  headerContent: DeviceHeaderContent | null;
  setHeaderContent: DeviceSetHeaderContent;
  setSearchFilter: SetSearchFilter;
};

const DeviceListHeader = ({
  headerContent,
  setHeaderContent,
  setSearchFilter,
}: Props): JSX.Element => {
  const devices = useSelector(deviceSelectors.all);
  const devicesLoaded = useSelector(deviceSelectors.loaded);
  const selectedDevices = useSelector(deviceSelectors.selected);

  return (
    <SectionHeader
      buttons={[
        <Button
          data-testid="add-device-button"
          disabled={selectedDevices.length > 0}
          onClick={() =>
            setHeaderContent({ view: DeviceHeaderViews.ADD_DEVICE })
          }
        >
          Add device
        </Button>,
        <NodeActionMenu
          nodes={selectedDevices}
          nodeDisplay="device"
          onActionClick={(action) => {
            const view = Object.values(DeviceHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setHeaderContent({ view });
            }
          }}
        />,
      ]}
      headerContent={
        headerContent && (
          <DeviceHeaderForms
            devices={selectedDevices}
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
          />
        )
      }
      subtitle={
        <ModelListSubtitle
          available={devices.length}
          filterSelected={() => setSearchFilter("in:(Selected)")}
          modelName="device"
          selected={selectedDevices.length}
        />
      }
      subtitleLoading={!devicesLoaded}
      title={getHeaderTitle("Devices", headerContent)}
    />
  );
};

export default DeviceListHeader;
