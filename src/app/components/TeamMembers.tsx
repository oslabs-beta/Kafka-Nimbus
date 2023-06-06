import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const TeamList = () => {
  // data of each individual feature card
  const Team = [
    {
      id: 1,
      alt: "Andrew",
      imageSrc: "https://res.cloudinary.com/dpqdqryvo/image/upload/v1686062389/Andrew_kevibc.jpg",
      Name: "Andrew Kim",
      github: "/github-logo.svg",
      LinkedIn: "/LinkedInLogo.png",
      githublink: "https://github.com/Akim97",
      LinkedInlink: "https://www.linkedin.com/in/andrew-kim1520/",
    },
    {
      id: 2,
      alt: "Paul",
      imageSrc: "https://res.cloudinary.com/dpqdqryvo/image/upload/v1686062705/Paul_Vachon_mctipz.jpg",
      Name: "Paul Vachon",
      github: "/github-logo.svg",
      LinkedIn: "/LinkedInLogo.png",
      githublink: "https://github.com/paulrvach",
      LinkedInlink: "https://www.linkedin.com/in/paul-vachon/",
    },
    {
      id: 3,
      alt: "Ariel",
      imageSrc: "https://res.cloudinary.com/dpqdqryvo/image/upload/v1686062599/Ariel_h65hwf.jpg",
      Name: "Ariel Lin",
      github: "/github-logo.svg",
      LinkedIn: "/LinkedInLogo.png",
      githublink: "https://github.com/ariellinn",
      LinkedInlink: "https://www.linkedin.com/in/ariellinn/",
    },
    {
      id: 4,
      alt: "Jackson",
      imageSrc: "https://res.cloudinary.com/dpqdqryvo/image/upload/v1686062669/JacksonImage_byhsyi.jpg",
      Name: "Jackson Dahl",
      github: "/github-logo.svg",
      LinkedIn: "/LinkedInLogo.png",
      githublink: "https://github.com/JacksonDahl2",
      LinkedInlink: "https://www.linkedin.com/in/jackson-dahl/",
    },
    {
      id: 5,
      alt: "Ijoo",
      imageSrc: "https://res.cloudinary.com/dpqdqryvo/image/upload/v1686062627/ijooimage_eggied.jpg",
      Name: "Ijoo Yoon",
      github: "/github-logo.svg",
      LinkedIn: "/LinkedInLogo.png",
      githublink: "https://github.com/ijoo123",
      LinkedInlink: "https://www.linkedin.com/in/ijooyoon/",
    },

  ];

  return (
    <div className="flex flex-wrap justify-center">
      {/*  iterate through TeamList array and populate new card for each element  */}
      {Team.map((member) => (
        <motion.div
          key={member.id}
          className="card mx-4 my-6 w- rounded-xl border border-solid border-gray-500 bg-transparent shadow-xl"
          whileHover={{ scale: 1.1 }}
          transition={{ stiffness: 400, damping: 10 }}
        >
          {/*  Profile Picture  */}
          <div className="member-body w-full h-full items-center text-center">
            <Image
              src={member.imageSrc}
              alt={member.alt}
              className="rounded-xl"
              width="200"
              height="200"
            />
            <h2 className="member-name">{member.Name}</h2>
            <div className="flex justify-center px-3">
              {/*  Linkedin Link  */}
              <Link href={member.LinkedInlink} className="mx-0 flex font-bold">
                <Image
                  src={member.LinkedIn}
                  alt="linkedin"
                  height="45"
                  width="45"
                ></Image>
              </Link>
              {/*  Github Link  */}
              <Link href={member.githublink} className="mx-0 flex font-bold">
                <Image
                  src={member.github}
                  alt="github"
                  height="45"
                  width="45"
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
