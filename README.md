# Kafka-Nimbus

<a name="readme-top"></a>

<br />
  <div align="center">
    <img src="./public/logo-black.png" alt="Logo" width="fit" height="auto">
  </div>
<br />

Kafka Nimbus is an open source product whose goal is to provide developers a method in which they can easily host their Kafka cluster onto. The user-friendly GUI allows direct visibility and modification of data like topic partitions and consumer group information, which are typically not readily accessible through the AWS interface.


For more information, visit our [website](www.google.com) or [LinkedIn](www.linkedin.com).
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
    <a href="#about-the-project">About Kafka Nimbus</a></li>
    <li><a href="#Features">Features</a></li>
    <li><a href="#Prerequisites">Creating an AWS user</a></li>
    <li><a href="#contributing">User Guide</a></li>
    <li><a href="#authors">Authors</a></li>
    <li><a href="#license">License</a></li>
  </ol>

<br />

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Features

- No download or installation required! Simply sign in using Github and start managing your clusters right away.
- Streamlines cluster creation by eliminating the reliance on AWS Managed Streaming for Apache Kafka (MSK) and provides a simplified, self-hosted solution.
- Intuitive interface that simplifies the management of multiple clusters at the same time.
- Real-time cluster health metrics monitoring, such as broker health, network usage, and message throughput.
- Offers precise customization of parameters when creating new clusters and topics.
- Delivers a secure and scalable solution by leveraging cloud infrastructure providers like AWS, ensuring clusters are fault tolerant and highly scalable.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Prerequisites:

To be able to use our application, you must have a working AWS IAM account. 
<br></br>

#### STEP 1 — Sign into you AWS account

Visit the AWS Management Console at https://aws.amazon.com/console/ and make a Root user account if you haven't already.

#### STEP 2 — Specify user details

Look for "IAM" in the AWS search bar and go to the IAM dashboard. Go to the "Users" tab under Access management and click on "Add users." You will be prompted to create a username. Once you are done with that, check the "Provide user access to the AWS Management Console" option. Checking that will open up a box asking "Are you providing console access to a person?" with two options to click between-- "Specify a user in Identity Center - Recommended" and "I want to create and IAM user." Check the second option. You will see an option for passwords, which you can keep the default configurations for.

#### STEP 3 — Set permissions

Between the permissions options at the top, click on "Add user to group." Under that, add the user to an existing user group or create a group by selecting "Create group" on the top-right corner of the box. Click next to move to the next page.

#### STEP 4 — Review, create, and retrieve password

Review if the user details and permissions summary is configured correctly and click "create user". Then, in the page to retrieve passwords, click on the "Email sign-in Instructions" button on the top-right corner of the Console sign-in details box. This will create an email draft that has all the sign in instructions that an IMA user will need that you can send. Make sure to download the CSV file containing the access key and secret access key


______________________________________________________






## Authors

| Developed By |                                                                     Github                                                                      |                                                                   LinkedIn                                                                    |
| :----------: | :---------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|  Andrew Kim  |    [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Akim97)    | [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrew-kim1520/) |
| Jackson Dahl | [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JacksonDahl2) |  [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jackson-dahl/)  |
|  Ariel Lin   |  [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ariellinn)   |   [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ariellinn/)    |
| Paul Vachon  |  [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/paulrvach)   |  [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/paul-vachon/)   |
|  Ijoo Yoon   |   [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ijoo123)    |    [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ijooyoon/)    |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


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
