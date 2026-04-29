import React from "react";

function Team() {
  return (
    <div className="container">
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center ">People</h1>
      </div>

      <div
        className="row p-3 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-3 text-center">
          <img
            src="media/images/nithinKamath.jpg"
            style={{ borderRadius: "100%", width: "50%" }}
          />
          <h4 className="mt-5">Amandeep Verma</h4>
          <h6>Full Stack Developer, Founder</h6>
        </div>
        <div className="col-6 p-3">
          <p>
            Amandeep bootstrapped and developed this Zerodha Clone to showcase 
            advanced full-stack development skills, integrating React, Node.js, 
            and MongoDB.
          </p>
          <p>
            He is passionate about financial technology and building scalable 
            web applications that provide real-world value.
          </p>
          <p>Building high-performance systems is his zen.</p>
          <p>
            Connect on <a href="https://github.com/amandeepverma3001">Github</a> / <a href="">LinkedIn</a> /{" "}
            <a href="">Portfolio</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
