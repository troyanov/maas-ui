import { Icon } from "@canonical/react-components";

import { DiskTypes } from "app/store/types/enum";
import type { Disk } from "app/store/types/node";

type Props = { disk: Disk };

const BootStatus = ({ disk }: Props): JSX.Element => {
  if (disk.type === DiskTypes.PHYSICAL) {
    return disk.is_boot ? <Icon name="tick" /> : <Icon name="close" />;
  }
  return <span>—</span>;
};

export default BootStatus;
