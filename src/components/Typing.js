import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const TypingEffect = () => {
  const el = useRef(null);

  useEffect(() => {
    const options = {
      strings: ["PROGRAMMER", "DEVELOPER", "DESIGNER", "CYCLIST", "CAT-LOVER"],
      typeSpeed: 150,
      backSpeed: 150,
      loop: true,
    };

    const typed = new Typed(el.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <h2 className="roles text-gray-400 text-4xl font-bold mt-2">//<span ref={el}></span></h2>
    </div>
  );
};

export default TypingEffect;
