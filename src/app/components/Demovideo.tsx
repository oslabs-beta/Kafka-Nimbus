// demonstration video
function Demovideo() {
  return (
    <video
      width="50%"
      height="50%"
      autoPlay
      playsInline
      muted
      loop
      className="shadow-2xl hover:shadow-2xl red"
    >
      <source src="https://res.cloudinary.com/dpqdqryvo/video/upload/v1685814776/test-demo-kafka_szbixp.mov" />
    </video>
  );
}

export default Demovideo;
