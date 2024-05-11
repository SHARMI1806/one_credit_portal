import React from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody } from "@windmill/react-ui";
import RoundIcon from "../components/RoundIcon";
import { FaComputer } from "react-icons/fa6";
import { MdOutlineElectricalServices } from "react-icons/md";
import { FcElectronics } from "react-icons/fc";
import { GrTechnology } from "react-icons/gr";
import { GiArtificialIntelligence } from "react-icons/gi";

const curriculum = [
  {
    id: 1,
    icon: FaComputer,
    name: "Computer Science",
    files: require("../curiculumn/cse.pdf")
  },
  {
    id: 2,
    icon: MdOutlineElectricalServices,
    name: "Electrical Communication",
    files: require("../curiculumn/ece.pdf")
  },
  {
    id: 3,
    icon: FcElectronics,
    name: "Electrical Engineering",
    files: require("../curiculumn/eee.pdf")
  },
  {
    id: 4,
    icon: GrTechnology,
    name: "Information Technology",
    files: require("../curiculumn/ise.pdf")
  },
  {
    id: 5,
    icon: GrTechnology,
    name: "Information Science",
    files: require("../curiculumn/it.pdf")
  },
  {
    id: 6,
    icon: GiArtificialIntelligence,
    name: "Artificial Intelligence",
    files: require("../curiculumn/aids.pdf")
  }
];

function Curriculum() {
  return (
    <>
      <PageTitle>Academic Curriculum</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {curriculum.map((course) => (
          <a key={course.id} href={course.files} target="_blank" rel="noopener noreferrer">
            <Card>
              <CardBody className="flex flex-col items-center">
                <RoundIcon
                  icon={course.icon}
                  iconColorClass="text-orange-500 dark:text-orange-100"
                  bgColorClass="bg-orange-100 dark:bg-orange-500"
                  className="mx-auto mb-4"
                />
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {course.name}
                  </p>
                </div>
              </CardBody>
            </Card>
          </a>
        ))}
      </div>
    </>
  );
}

export default Curriculum;
