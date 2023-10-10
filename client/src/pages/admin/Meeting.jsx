import { JaaSMeeting} from "@jitsi/react-sdk";

const Meeting = () => {
  return (
    <JaaSMeeting
      appId="vpaas-magic-cookie-5814ee87e8c248b5b1800add388455d3"
      roomName="CODEVERSE"
      // jwt = { YOUR_VALID_JWT }
      configOverwrite={{
        disableThirdPartyRequests: true,
        disableLocalVideoFlip: true,
        backgroundAlpha: 0.5,
        constraints: {
          video: {
            height: { ideal: 720, max: 720, min: 180 },
            width: { ideal: 1280, max: 1280, min: 320 },
            frameRate: { max: 30, min: 15 },
            facingMode: "user",
          },
          audio: {
            autoGainControl: true,
            echoCancellation: true,
            noiseSuppression: true,
          },
        },
      }}
      interfaceConfigOverwrite={{
        VIDEO_LAYOUT_FIT: "nocrop",
        MOBILE_APP_PROMO: false,
        TILE_VIEW_MAX_COLUMNS: 4,
      }}
      // spinner = { SpinnerView }
      // onApiReady = { (externalApi) => { } }
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = "100vh";
        iframeRef.style.width = "201vh";
      }}
    />
  );
};

export default Meeting;
