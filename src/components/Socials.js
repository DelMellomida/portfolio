import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

const Socials = () => {
  return (
    <div className="flex space-x-4 mt-5 flex-wrap justify-center md:justify-start z-50">
      <a href="https://www.facebook.com/jhondel.jumuadmellomida/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
        <FontAwesomeIcon icon={faFacebook} size="2x" />
      </a>
      <a href="https://www.instagram.com/jhndlmllmd/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600">
        <FontAwesomeIcon icon={faInstagram} size="2x" />
      </a>
      <a href="https://www.linkedin.com/in/jhondel-mellomida-415b54318/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
        <FontAwesomeIcon icon={faLinkedin} size="2x" />
      </a>
      <a href="https://github.com/DelMellomida" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
        <FontAwesomeIcon icon={faGithub} size="2x" />
      </a>
    </div>
  );
};

export default Socials;
