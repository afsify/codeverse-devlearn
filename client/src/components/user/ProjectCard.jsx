import PropTypes from "prop-types";

const ProjectCard = ({ project }) => {
  return (
    <div  className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-md transition duration-300 ease-in-out">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-60 object-cover object-center"
      />
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {project.title}
        </h2>
        <p className="text-gray-600 text-sm mb-4">{project.description}</p>
        <div className="flex justify-between">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub
          </a>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.node.isRequired,
};

export default ProjectCard;
