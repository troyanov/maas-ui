import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import machineURLs from "app/machines/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId?: Machine[MachineMeta.PK] | null;
};

const MachineLink = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const machinesLoading = useSelector(machineSelectors.loading);

  useEffect(() => {
    dispatch(machineActions.fetch());
  }, [dispatch]);

  if (machinesLoading) {
    // TODO: Put aria-label directly on Spinner component when issue is fixed.
    // https://github.com/canonical-web-and-design/react-components/issues/651
    return (
      <span aria-label="Loading machines">
        <Spinner />
      </span>
    );
  }
  if (!machine) {
    return null;
  }
  return (
    <Link to={machineURLs.machine.index({ id: machine.system_id })}>
      <strong>{machine.hostname}</strong>
      <span>.{machine.domain.name}</span>
    </Link>
  );
};

export default MachineLink;
