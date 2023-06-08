# Kafka-Nimbus

<a name="readme-top"></a>

<div align="center" width="100%">   
            
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
            
</div>
            
<!-- PROJECT LOGO -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/oslabs-beta/Kafka-Nimbus">
    <img src="assets/extended-dark.png" alt="Logo" width="550" height="auto">
  </a>
  <br />
  https://kafka-nimbus.io/
<br/>
  
   <br /> 
  <p align="center">
  Kafka Nimbus is a developer-friendly web application that provides a GUI(Graphical User Interface) to easily deploy 
    <br />
    <a href="https://github.com/open-source-labs/Docketeer"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/open-source-labs/Docketeer#about-the-project">View Demo</a>
    ·
    <a href="https://github.com/open-source-labs/Docketeer/issues">Report Bug</a>
    ·
    <a href="https://github.com/open-source-labs/Docketeer/issues">Request Feature</a>
  </p>
</div>

<br />
<!-- TABLE OF CONTENTS -->

<br />

## Table of Contents

  <ol>
      <br />
    <li>
    <a href="#about-the-project">About Docketeer</a></li>
    <li><a href="#installation">Prerequisites</a></li>
    <li><a href="#in-development">In Development</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#authors">Authors</a></li>
  </ol>

<!-- ABOUT THE PROJECT -->
<br />

## About The Project

<div align="center" width="100%">
            
[![Typescript][TS.js]][TS-url][![JavaScript][JavaScript]][JavaScript-url][![React][React.js]][React-url][![Redux][Redux]][Redux-url][![ReduxTK][ReduxTK]][ReduxTK-url][![Grafana][Grafana]][Grafana-url][![Prometheus][Prometheus]][Prometheus-url][![Jest][Jest]][Jest-url][![][Git]][Git-url][![Tailwind][Tailwind]][Tailwind-url][![trpc][tRPC]](https://trpc.io/)[![NextJS][NextJs]](NextJS-url)[![Prisma][Prisma]][Prisma-url][![NextAuth][NextAuth]][NextAuth-url][![KafkaJS][KafkaJS]][KafkaJS-url][![Docker][Docker]][Docker-url][![AWS][AWS]][AWS-url]



</div>

<br />
  <div align="center">
    <img src="assets/FullDemo.gif" alt="Logo" width="fit" height="auto">
  </div>
<br />


Docketeer is an open source initiative comprising contributions from dozens of talented and passionate software engineers. Our application provides a simple interface to manage Docker resources & visualize both host and container metric data, along with Kubernetes cluster data. Docketeer is a containerized application that can be deployed alongside your application cluster with hardly any effort. To learn more about our application and how to get started, keep reading!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Features:

- Simplifies the process of creating and hosting Apache Kafka cluster onto the cloud
- Compatible with 
- Allows you to filter through both your running and stopped container logs. 
- Docketeer provides an easy-to-use command-line interface for managing Docker containers, images, and networks.
- With Docketeer, developers can quickly create, start, stop, and delete containers, as well as manage Docker networks and images.
- Docketeer includes a variety of features, including automatic container naming, customizable configurations, and support for multiple Docker Compose - files.
- Docketeer offers Node and kubelet metrics visualizations for your Kubernetes clusters, along with an easy set up process to get your cluster connected to the application. 
- Docketeer also offers built-in support for popular development frameworks like Rails and Node.js, making it easy to get started with these technologies.
- Docketeer is highly customizable, and developers can configure it to suit their specific needs.
- It's a community-maintained project, with frequent updates and bug fixes.
- Docketeer is licensed under the MIT license, meaning it can be used and modified freely, even for commercial projects.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- INSTALLATION -->

## Installation

The local configuration for Docketeer was setup to be as simple as possible for the end-user. <br />
Follow the steps below to get started with Docketeer.

#### Prerequisites:
You must have Docker Desktop installed!
<br></br>

#### STEP 1 — Clone the repository

```sh
git clone https://github.com/open-source-labs/Docketeer.git
```

#### STEP 2 — Docker compose up

Making sure you're in your Docketeer directory, run:
```sh
docker compose up
```

#### STEP 2.5 — Need to set up your Kubernetes cluster to work with Docketeer?

Open up a new tab in your terminal, run the following command, and then navigate to [localhost:4001/api/k8](http://localhost:4001/api/k8):
```sh
npm run dev
``` 

If you haven't set up Prometheus-Operator with us before, click the first button to install. 
<br />
Otherwise, you can skip the first button and go on with the next two!
<br />
P.S. Make sure to keep this terminal open!

#### STEP 3 — Navigate to localhost:4000 to sign-up & login!

```sh
http://localhost:4000
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- IN DEVELOPMENT -->

## In Development

- [ ] Support for more development frameworks and languages, such as Next.JS.
- [ ] Improved support for Docker networking, including more advanced configurations and better integration with other network tools.
- [ ] Expand Docker networking capabilities within Docketeer to provide more sophisticated networking configurations and better interoperability with other network tools.
- [ ] Develop more advanced container configuration options within Docketeer, such as load balancing or high availability setups.
- [ ] Integrate Docketeer with popular development tools like IDEs or continuous integration/delivery systems for better automation and workflow efficiency.
- [ ] Add support for more advanced Docker features, like multi-stage builds or Docker secrets, to expand the capabilities of Docketeer.
- [ ] Develop integration with cloud services like AWS or Azure to simplify the deployment of Docker-based applications.
- [ ] Display additional metrics for Kubernetes clusters.

See the [open issues](https://github.com/open-source-labs/Docketeer/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repository and create a pull request. You can also simply open an issue describing your contribution.
Don't forget to give the project a star! Thanks again!

1. Fork the project and clone onto your local machine
3. Create your Feature Branch (`git checkout -b feature/NewFeatureName`)
4. Commit your Changes (`git commit -m '(feature/bugfix/style/etc.): [commit message here]'`)
5. Push to the Branch (`git push origin feature/NewFeatureName`)
6. Open a Pull Request
7. Create an issue on GitHub (as mentioned above!)

Read our [contributing guide](https://github.com/open-source-labs/Docketeer/blob/master/CONTRIBUTING.md) for more information on how to purpose bugfixes and improvements to Docketeer.


## Authors

| Developed By       | Github          | LinkedIn        |
| :------------------: | :-------------: | :-------------: |
| Andrew Kim | [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Akim97) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrew-kim1520/) |
| Jackson Dahl | [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JacksonDahl2) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jackson-dahl/) |
| Ariel Lin | [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ariellinn) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ariellinn/) |
| Paul Vachon | [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/paulrvach) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/paul-vachon/) |
| Ijoo Yoon | [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ijoo123) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ijooyoon/) |


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/open-source-labs/Docketeer.svg?style=for-the-badge
[contributors-url]: https://github.com/open-source-labs/Docketeer/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/open-source-labs/Docketeer.svg?style=for-the-badge
[forks-url]: https://github.com/open-source-labs/Docketeer/network/members
[stars-shield]: https://img.shields.io/github/stars/open-source-labs/Docketeer.svg?style=for-the-badge
[stars-url]: https://github.com/open-source-labs/Docketeer/stargazers
[issues-shield]: https://img.shields.io/github/issues/open-source-labs/Docketeer.svg?style=for-the-badge
[issues-url]: https://github.com/open-source-labs/Docketeer/issues
[license-shield]: https://img.shields.io/github/license/open-source-labs/Docketeer.svg?style=for-the-badge
[license-url]: https://github.com/open-source-labs/Docketeer/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/company/docketeer
[product-screenshot]: images/screenshot.png
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
[NextJS]:https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[NextJS-url]:https://nextjs.org/
[Prisma]:https://img.shields.io/badge/Prisma-%233b3e44?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[NextAuth]:https://img.shields.io/badge/NextAuth-%23F05033.svg?style=for-the-badge&logo=nextdotjs&logoColor=white   
[NextAuth-url]:https://next-auth.js.org/
[KafkaJS]:https://img.shields.io/badge/KafkaJS-%2316AB39.svg?style=for-the-badge&logo=kafkajs&logoColor=white
[KafkaJS-url]:https://kafka.js.org/
[AWS]:https://img.shields.io/badge/AWS-%231E73BE.svg?style=for-the-badge&logo=amazon-aws&logoColor=white:
[AWS-url]:https://aws.amazon.com/










