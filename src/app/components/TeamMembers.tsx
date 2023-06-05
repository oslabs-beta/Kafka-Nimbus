import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const TeamList = () => {
  // data of each individual feature card
  const Team = [
    {
      id: 1,
      alt: "Andreww",
      imageSrc: "/aws-logo.svg",
      NamedNodeMap: "Andrew Kim",
      github: "/github-logo.svg",
      LinkedIn: "/LinkedIn_logo.svg",
      githublink: "https://github.com/Akim97",
      LinkedInlink: "https://www.linkedin.com/in/andrew-kim1520/",
    },
    {
      id: 2,
      alt: "Jackson",
      imageSrc: "/monitor.svg",
      NamedNodeMap: "Jackson Dahl",
      github: "/github-logo.svg",
      LinkedIn: "/LinkedIn_logo.svg",
      githublink: "https://github.com/JacksonDahl2",
      LinkedInlink: "https://www.linkedin.com/in/jackson-dahl/",
    },
    {
      id: 3,
      alt: "Ariel",
      imageSrc: "/kafka.svg",
      NamedNodeMap: "Ariel Lin",
      github: "/github-logo.svg",
      LinkedIn: "/LinkedIn_logo.svg",
      githublink: "https://github.com/ariellinn",
      LinkedInlink: "https://www.linkedin.com/in/ariellinn/",
    },
    {
      id: 4,
      alt: "Ijoo",
      imageSrc: "/design.svg",
      Name: "Ijoo Yoon",
      github: "/github-logo.svg",
      LinkedIn: "/LinkedIn_logo.svg",
      githublink: "https://github.com/ijoo123",
      LinkedInlink: "https://www.linkedin.com/in/ijooyoon/",
    },
    {
      id: 5,
      alt: "Paul",
      imageSrc: "/lock.svg",
      Name: "Paul Vachon",
      github: "/github-logo.svg",
      LinkedIn: "/LinkedIn_logo.svg",
      githublink: "https://github.com/paulrvach",
      LinkedInlink: "https://www.linkedin.com/in/paul-vachon/",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center">
      {/*  iterate through TeamList array and populate new card for each element  */}
      {Team.map((member) => (
        <motion.div
          key={member.id}
          className="card mx-4 my-6 w-96 max-w-xs rounded-xl border border-solid border-gray-500 bg-transparent shadow-xl"
          whileHover={{ scale: 1.1 }}
          transition={{ stiffness: 400, damping: 10 }}
        >
          {/*  Profile Picture  */}
          <div className="member-body items-center text-center">
            <Image
              src={member.imageSrc}
              alt={member.alt}
              className="rounded-xl"
              height="100"
              width="100"
            />
            <h2 className="member-name">{member.Name}</h2>
            <div className="flex justify-center px-3">
              {/*  Linkedin Link  */}
              <Link href={member.LinkedInlink} className="mx-0 flex font-bold">
                <Image
                  src={member.LinkedIn}
                  alt="linkedin"
                  height="60"
                  width="200"
                ></Image>
              </Link>
              {/*  Github Link  */}
              <Link href={member.githublink} className="mx-0 flex font-bold">
                <Image
                  src={member.github}
                  alt="github"
                  height="60"
                  width="60"
                ></Image>
              </Link>
            </div>
            <div className="relative w-auto rounded-xl"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamList;
