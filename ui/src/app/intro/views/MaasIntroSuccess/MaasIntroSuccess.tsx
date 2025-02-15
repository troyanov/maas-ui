import { Button, List } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import IntroCard from "app/intro/components/IntroCard";
import IntroSection from "app/intro/components/IntroSection";
import { useExitURL } from "app/intro/hooks";
import introURLs from "app/intro/urls";
import authSelectors from "app/store/auth/selectors";
import { actions as configActions } from "app/store/config";

const MaasIntroSuccess = (): JSX.Element => {
  const dispatch = useDispatch();
  const authUser = useSelector(authSelectors.get);
  const exitURL = useExitURL();
  const continueLink = authUser?.completed_intro ? exitURL : introURLs.user;

  return (
    <IntroSection windowTitle="Success">
      <IntroCard
        complete={true}
        data-testid="maas-connectivity-form"
        title="MAAS has been successfully set up"
      >
        <List
          items={[
            "Once DHCP is enabled, set your machines to PXE boot and they will be automatically enlisted in the Machines tab.",
            "Discovered MAC/IP pairs in your network will be listed on your dashboard and can be added to MAAS.",
            "The fabrics, VLANs and subnets in your network will be automatically added to MAAS in the Subnets tab.",
          ]}
        />
      </IntroCard>
      <div className="u-align--right">
        <Button element={Link} to={introURLs.images}>
          Back
        </Button>
        <Button
          appearance="positive"
          data-testid="continue-button"
          element={Link}
          onClick={() => {
            dispatch(configActions.update({ completed_intro: true }));
          }}
          to={continueLink}
        >
          Finish setup
        </Button>
      </div>
    </IntroSection>
  );
};

export default MaasIntroSuccess;
