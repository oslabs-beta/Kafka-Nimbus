import { motion } from "framer-motion";
import Image from "next/image";

const FeaturesList = () => {
  // data of each individual feature card
  const cardsData = [
    {
      id: 1,
      alt: 'aws',
      imageSrc: "/aws-logo.svg",
      title: "AWS Support",
      description: "Create clusters directly onto the AWS cloud using MSK",
    },
    {
      id: 2,
      alt: 'monitor',
      imageSrc: "/monitor.svg",
      title: "Broker Health",
      description: "Real-time monitoring of broker data",
    },
    {
      id: 3,
      alt: 'kafka',
      imageSrc: "/kafka.svg",
      title: "Cluster Management",
      description: "Oversee and manage multiple clusters simultaneously",
    },
    {
      id: 4,
      alt: 'design',
      imageSrc: "/design.svg",
      title: "User-Friendly Design",
      description: "Design optimized for best user experience",
    },
    {
      id: 5,
      alt: 'lock',
      imageSrc: "/lock.svg",
      title: "Secure Login and Authentication",
      description: "Authenticates user with GitHub for enhanced security and tracks continuous session data.",
    },
    {
      id: 6,
      alt: 'prometheus',
      imageSrc: "/prometheus.svg",
      title: "Monitor your Advanced Metrics",
      description: "View comprehensive cluster data with Prometheus-powered metrics analysis",
    },
    {
      id: 7,
      alt: 'topics',
      imageSrc: "/topics.svg",
      title: "Create New Topics",
      description: "Analyze topics metadata, and create new topics with customizable parameters",
    },
    {
      id: 8,
      alt: 'cookies',
      imageSrc: "/cookies.svg",
      title: "Sessions",
      description: "Ensures persistent login across sessions, maintaining user authentication even when exiting the web application.",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center">
      {/*  iterate through cardsData array and populate new card for each element  */}
      {cardsData.map(card => (
        <motion.div
          key={card.id}
          className="card mx-4 my-6 w-96 max-w-xs rounded-xl bg-transparent shadow-xl border-solid border-gray-500 border"
          whileHover={{ scale: 1.1 }}
          transition={{ stiffness: 400, damping: 10 }}
        >
          <div className="card-body items-center text-center">
            <h2 className="card-title">{card.title}</h2>
            <div
              className="relative w-auto rounded-xl"
            >
              <Image
                src={card.imageSrc}
                alt={card.alt}
                className="rounded-xl"
                height="100"
                width="100"
              />
            </div>
            <p>{card.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturesList;
