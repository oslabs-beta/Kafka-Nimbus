# Kafka-Nimbus

<a name="readme-top"></a>

<br />
  <div align="center">
    <img src="./public/logo-black.png" alt="Logo" width="fit" height="auto">
  </div>
<br />

### About Kafka Nimbus


Kafka Nimbus is an open source product whose goal is to provide developers a method in which they can easily host their Kafka cluster onto the cloud. The user-friendly GUI allows direct visibility and modification of data like topic partitions and consumer group information, which are typically not readily accessible through the AWS interface.


For more information, visit our [website](https://kafka-nimbus.vercel.app/) and our [medium article](https://medium.com/@ijooyoon/kafkanimbus-a-simpler-way-to-deploy-your-kafka-clusters-dab567609651).
<br />
<br />

## Tech Stacks

<div align="center" width="100%">
            
[![Typescript][TS.js]][TS-url][![JavaScript][JavaScript]][JavaScript-url][![React][React.js]][React-url][![Redux][Redux]][Redux-url][![ReduxTK][ReduxTK]][ReduxTK-url][![Grafana][Grafana]][Grafana-url][![Prometheus][Prometheus]][Prometheus-url][![Jest][Jest]][Jest-url][![][Git]][Git-url][![Tailwind][Tailwind]][Tailwind-url][![trpc][tRPC]](https://trpc.io/)[![NextJS][NextJs]](NextJS-url)[![Prisma][Prisma]][Prisma-url][![NextAuth][NextAuth]][NextAuth-url][![KafkaJS][KafkaJS]][KafkaJS-url][![Docker][Docker]][Docker-url][![AWS][AWS]][AWS-url]

</div>


<br />
<br />

## Table of Contents

  <ol>
    <li>
    <a href="#about-kafka-nimbus">About Kafka Nimbus</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#user-guide">User Guide </a></li>
    <li><a href="#authors">Authors</a></li>
    <li><a href="#license">License</a></li>
  </ol>

<br />

<br />


### Features

- No download or installation required! Simply sign in using Github and start managing your clusters right away.
- Streamlines cluster creation by eliminating the reliance on AWS Managed Streaming for Apache Kafka (MSK) and provides a simplified, self-hosted solution.
- Intuitive interface that simplifies the management of multiple clusters at the same time.
- Real-time cluster health metrics monitoring, such as broker health, network usage, and message throughput.
- Offers precise customization of parameters when creating new clusters and topics.
- Delivers a secure and scalable solution by leveraging cloud infrastructure providers like AWS, ensuring clusters are fault tolerant and highly scalable.

<br />

### User guide


#### STEP 1 — Create an AWS account

- Visit the AWS Management Console at https://aws.amazon.com/console/ and create a Root user account.


#### STEP 2 — Create new users

- On the left bar, click Users, and make a new user, checking off the box saying `Provide user access to the AWS Management Console` and `I want to create an IAM user`. Don't forget to make a new user for yourself.

#### STEP 3 — Assigning policies to user

- Navigate to the IAM dashboard through the searchbar click on users. Add the following permissions to each new user created.
    - `Amazon MSK full access`
    - `Amazon VPC full access` 

    <br />
  <div align="center">
    <img src="https://res.cloudinary.com/dpqdqryvo/image/upload/v1686340287/Permissions_kb8p2j.png" alt="Logo">
  </div>
<br />

#### STEP 4 — Generating New Access Keys

- Create an secret access key for the new user.


#### STEP 5 — Add users to Group

- Go to the newly created group, add new team members to the group


#### STEP 6 — Creating a new cluster

- Click on the create a cluster card input the AWS credentials that you have saved. It will only ask you for the first time you create a new cluster.


#### STEP 7 — View cluster metrics

- Navigate to different pages to view different cluster information through the menu on the left

  <div align="center">
      <video
        autoPlay
        playsInline
        muted
        loop
        src="https://res.cloudinary.com/dpqdqryvo/video/upload/v1686340611/ViewingData_we9gqj.mp4"
      </video>
  </div>

<br />





<br />
<br />
<br />

______________________________________________________

## Authors

| Developed By |                                                                     Github                                                                      |                                                                   LinkedIn                                                                    |
| :----------: | :---------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|  Andrew Kim  |    [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Akim97)    | [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrew-kim1520/) |
| Jackson Dahl | [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JacksonDahl2) |  [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jackson-dahl/)  |
|  Ariel Lin   |  [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ariellinn)   |   [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ariellinn/)    |
| Paul Vachon  |  [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/paulrvach)   |  [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/paul-vachon/)   |
|  Ijoo Yoon   |   [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ijoo123)    |    [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ijooyoon/)    |


<br />
<br />
<br />

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.



[React.js]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://reactjs.org/
[TS.js]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TS-url]: https://www.typescriptlang.org/
[Grafana]: https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white
[Grafana-url]: https://grafana.com/
[Prometheus]: https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white
[Prometheus-url]: https://prometheus.io/
[JavaScript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[JavaScript-url]: https://www.javascript.com/
[Redux]: https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white
[Redux-url]: https://redux.js.org/
[ReduxTK]: https://img.shields.io/badge/Redux_Toolkit-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white
[ReduxTK-url]: https://redux-toolkit.js.org/
[Jest]: https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white
[Jest-url]: https://jestjs.io/
[Docker]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[Git]: https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white
[Git-url]: https://git-scm.com/
[tRPC]: https://img.shields.io/badge/trpc-%235755D9.svg?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgdmlld0JveDdyYXBwZXI9IjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPHBhdGggZD0iTTEuNzg0MzUgNWMtMi4wNzY3NC02Ljg3ODg3LTYuODc4ODgtMTAuNTEzLTExLjQ0NTMtMTAuNTEzUzExLjQ0NTMgMCAxLjc4NDM1IDAgOWMtMy42NzE3MiAwLTcuMDg0NTcgMy41OTcyNS03LjA4NDU3LTIuMTA1ODMtMi4xMDU4My0zLjg2NzU0IDAtNy4wODY1MSAzLjU5NzI1LTcuMDg1NzYgMi4wNTg0My0yLjEwNTgzIDMuODY3NTQtNy4wODU3NCA3LjA4NTc1LTcuMDg1NzRoMy4yNzczMSIgZmlsbD0ibm9uZSIvPjwvc3ZnPgo=
[tRPC-url]: https://www.w3schools.com/css/
[Tailwind]: https://img.shields.io/badge/Tailwind-%231DA1F2.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[NextJS]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[NextJS-url]: https://nextjs.org/
[Prisma]: https://img.shields.io/badge/Prisma-%233b3e44?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[NextAuth]: https://img.shields.io/badge/NextAuth-%23F05033.svg?style=for-the-badge&logo=nextdotjs&logoColor=white
[NextAuth-url]: https://next-auth.js.org/
[KafkaJS]: https://img.shields.io/badge/KafkaJS-%2316AB39.svg?style=for-the-badge&logo=kafkajs&logoColor=white
[KafkaJS-url]: https://kafka.js.org/
[AWS]: https://img.shields.io/badge/AWS-%231E73BE.svg?style=for-the-badge&logo=amazon-aws&logoColor=white:
[AWS-url]: https://aws.amazon.com/
