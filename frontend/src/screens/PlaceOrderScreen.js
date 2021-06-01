import React, { useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { Link } from "react-router-dom";
import { createOrder } from "../actions/orderActions";
import { USER_DETAILS_RESET } from "../constants/userConstants";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

const PlaceOrderScreen = ({ history }) => {
	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);

	if (!cart.shippingAddress.address) {
		history.push("/shipping");
	} else if (!cart.paymentMethod) {
		history.push("/payment");
	}

	// Calculate prices
	cart.itemsPrice = Number(
		cart.cartItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		)
	).toFixed(2);

	cart.shippingPrice = Number(cart.itemsPrice > 100 ? 0 : 20).toFixed(2);

	cart.taxPrice = Number((0.15 * cart.itemsPrice).toFixed(2));

	cart.totalPrice =
		Number(cart.itemsPrice) +
		Number(cart.shippingPrice) +
		Number(cart.taxPrice);

	const orderCreate = useSelector((state) => state.orderCreate);
	const { order, success, error } = orderCreate;

	useEffect(() => {
		if (success) {
			history.push(`/order/${order._id}`);
			dispatch({ type: USER_DETAILS_RESET });
			dispatch({ type: ORDER_CREATE_RESET });
		}
		// eslint-disable-next-line
	}, [history, success]);

	const placeOrderHandler = (e) => {
		e.preventDefault();
		dispatch(
			createOrder({
				orderItems: cart.cartItems,
				shippingAddress: cart.shippingAddress,
				paymentMethod: cart.paymentMethod,
				itemsPrice: cart.itemsPrice,
				shippingPrice: cart.shippingPrice,
				taxPrice: cart.taxPrice,
				totalPrice: cart.totalPrice,
			})
		);
	};

	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
								{cart.shippingAddress.postalCode},{" "}
								{cart.shippingAddress.country},
							</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Information</h2>
							<p>
								<strong>Method: </strong>
								{cart.paymentMethod}
							</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Details</h2>
							{cart.cartItems.length === 0 ? (
								<Message>Your Cart is Empty</Message>
							) : (
								<ListGroup variant="flush">
									{cart.cartItems.map((cartItem, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={2}>
													<Image
														src={cartItem.img}
														alt={cartItem.name}
														fluid
														rounded
													></Image>
												</Col>
												<Col>
													<Link to={`/product/${cartItem.id}`}>
														{cartItem.name}
													</Link>
												</Col>
												<Col md={4}>
													{cartItem.quantity} x ${cartItem.price} = $
													{cartItem.quantity * cartItem.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
							<p></p>
						</ListGroup.Item>
					</ListGroup>
				</Col>

				<Col md={4}>
					<Card className="order__summary">
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${cart.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${cart.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${cart.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${Number(cart.totalPrice).toFixed(2)}</Col>
								</Row>
							</ListGroup.Item>
							{error && (
								<ListGroup.Item>
									{error && <Message variant="danger">{error}</Message>}
								</ListGroup.Item>
							)}

							<ListGroup.Item>
								<Button
									type="button"
									className="btn-block"
									disabled={cart.cartItems === 0}
									onClick={placeOrderHandler}
								>
									Place Order
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default PlaceOrderScreen;
