import type { ReactNode } from "react";
import { useState } from "react";

import { Strip } from "@canonical/react-components";

import type { NetworkInterface, NetworkLink } from "app/store/types/node";

export enum ExpandedState {
  ADD_ALIAS = "addAlias",
  ADD_BOND = "addBond",
  ADD_BRIDGE = "addBridge",
  ADD_PHYSICAL = "addPhysical",
  ADD_VLAN = "addVlan",
  DISCONNECTED_WARNING = "disconnectedWarning",
  EDIT = "edit",
  MARK_CONNECTED = "markConnected",
  MARK_DISCONNECTED = "markDisconnected",
  REMOVE = "remove",
}

export type Expanded = {
  content: ExpandedState;
  linkId?: NetworkLink["id"] | null;
  nicId?: NetworkInterface["id"] | null;
};

export type SetExpanded = (expanded: Expanded | null) => void;

type GetComponent = (
  expanded: Expanded | null,
  setExpanded: SetExpanded
) => ReactNode;

type Props = {
  actions: GetComponent;
  addInterface?: GetComponent;
  dhcpTable: GetComponent;
  expandedForm: GetComponent;
  interfaceTable: GetComponent;
};

const NodeNetworkTab = ({
  actions,
  addInterface,
  dhcpTable,
  expandedForm,
  interfaceTable,
}: Props): JSX.Element => {
  const [expanded, setExpanded] = useState<Expanded | null>(null);
  if (expanded) {
    const form = expandedForm(expanded, setExpanded);
    if (form) {
      return <>{form}</>;
    }
  }
  return (
    <>
      {actions(expanded, setExpanded)}
      <Strip shallow>
        {interfaceTable(expanded, setExpanded)}
        {addInterface && expanded?.content === ExpandedState.ADD_PHYSICAL
          ? addInterface(expanded, setExpanded)
          : null}
      </Strip>
      {dhcpTable(expanded, setExpanded)}
    </>
  );
};

export default NodeNetworkTab;
