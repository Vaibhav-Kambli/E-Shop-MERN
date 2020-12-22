import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
	return (
		<Container>
			<hr />
			<Row className="mt-1">
				<Col className="text-right py-1" md={6}>
					<h5>Contact info:</h5>
				</Col>
				<Col className="text-left">
					<a
						href="https://www.linkedin.com/in/vaibhav-kambli"
						rel="noopener noreferrer"
						target="_blank"
					>
						<i
							className="fab fa-linkedin fa-2x"
							style={{ color: "#0073B1", marginRight: "20px" }}
						/>
					</a>

					<a
						href="https://github.com/Vaibhav-Kambli"
						rel="noopener noreferrer"
						target="_blank"
					>
						<i
							className="fab fa-github fa-2x"
							style={{ color: "black", marginRight: "20px" }}
						/>
					</a>

					<a href={`mailto:vaibhavk2608@gmail.com`}>
						<i
							className="fas fa-envelope fa-2x"
							style={{ color: "black", marginRight: "20px" }}
						/>
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
