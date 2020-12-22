import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
	return (
		<Container>
			<hr />
			<Row>
				<Col className="text-right pb-2 ">
					<a
						href="https://www.linkedin.com/in/vaibhav-kambli"
						rel="noopener noreferrer"
						target="_blank"
					>
						<i
							className="fab fa-linkedin fa-2x"
							style={{ color: "#0073B1" }}
						/>
						<span className="p-2 mb-4">LinkedIn</span>
					</a>
				</Col>
				<Col className="text-center pb-2 ">
					<a
						href="https://github.com/Vaibhav-Kambli"
						rel="noopener noreferrer"
						target="_blank"
					>
						<i
							className="fab fa-github fa-2x"
							style={{ color: "black" }}
						/>
						<span className="ml-2">GitHub</span>
					</a>
				</Col>
				<Col className="text-left pb-2  ">
					<a href={`mailto:vaibhavk2608@gmail.com`}>
						<i
							className="fas fa-envelope fa-2x"
							style={{ color: "black" }}
						/>
						<span className="text-center p-2">Gmail</span>
					</a>
				</Col>
			</Row>
			<Row>
				<Col className="text-center py-1 mb-1">
					Copyright &copy; 2020 E-Shop
				</Col>
			</Row>
		</Container>
	);
};

export default Footer;
