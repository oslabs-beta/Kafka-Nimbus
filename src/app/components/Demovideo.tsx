import { CldVideoPlayer } from "next-cloudinary";

function Demovideo() {

  return (
    <CldVideoPlayer
      width="400"
      height="400"
      src="test-demo-kafka_szbixp"
      controls={false}
      quality="auto"
    />
  );
}

export default Demovideo;