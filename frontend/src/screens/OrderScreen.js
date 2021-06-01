import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import StripeLoading from "../components/StripeLoading";
import {
	getOrderDetails,
	payOrder,
	deliverOrder,
} from "../actions/orderActions";
import {
	ORDER_PAY_RESET,
	ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const OrdersScreen = ({ match, history }) => {
	const orderId = match.params.id;

	// cart data

	const [sdkReady, setSdkReady] = useState(false);

	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const orderDetails = useSelector((state) => state.orderDetails);
	const { order, loading, error } = orderDetails;

	const orderPay = useSelector((state) => state.orderPay);
	const { loading: loadingPay, success: successPay } = orderPay;

	const orderDeliver = useSelector((state) => state.orderDeliver);
	const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

	if (!loading) {
		order.itemsPrice = Number(
			order.orderItems.reduce(
				(total, item) => total + item.price * item.quantity,
				0
			)
		).toFixed(2);
	}

	// Stripe constants
	const [succeeded, setSucceeded] = useState(false);
	const [errorStripe, setErrorStripe] = useState(null);
	const [processing, setProcessing] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [clientSecret, setClientSecret] = useState("");
	const stripe = useStripe();
	const elements = useElements();

	useEffect(() => {
		if (!userInfo) {
			history.push("/login");
		}

		const addPayPalScript = async () => {
			const { data: clientId } = await axios.get("/api/config/paypal");

			const script = document.createElement("script");
			script.type = "text/javascript";
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=INR`;
			script.async = true;
			script.onload = () => {
				setSdkReady(true);
			};

			document.body.appendChild(script);
		};

		if (!order || successPay || successDeliver || order._id !== orderId) {
			dispatch({
				type: ORDER_PAY_RESET,
			});
			dispatch({
				type: ORDER_DELIVER_RESET,
			});
			dispatch(getOrderDetails(orderId));
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPayPalScript();
			} else {
				setSdkReady(true);
			}
		}

		if (order && order.totalPrice > 0 && !successPay) {
			try {
				fetch("/api/payment", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						price: order.totalPrice,
						userInfo: userInfo,
					}),
				})
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						setClientSecret(data.clientSecret);
					});
			} catch (err) {
				console.log(err);
			}
		}
	}, [order, orderId, successPay, dispatch, successDeliver, history, userInfo]);

	// Handle paypal submit button
	const successPaymentHandler = (paymentResult) => {
		dispatch(payOrder(orderId, paymentResult));
	};

	const deliverHandler = () => {
		dispatch(deliverOrder(orderId));
	};

	const handleSubmit = async (ev) => {
		ev.preventDefault();
		setProcessing(true);

		const payload = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
			},
			setup_future_usage: "off_session",
		});

		if (payload.error) {
			setErrorStripe(`Payment failed ${payload.error.message}`);
			setProcessing(false);
		} else {
			setErrorStripe(null);
			setProcessing(false);
			setSucceeded(true);
			setTimeout(() => {
				dispatch(payOrder(order, { method: "stripe" }));
			}, 5000);
		}
	};

	const handleChange = async (event) => {
		setDisabled(event.empty);
		setErrorStripe(event.error ? event.error.message : "");
	};

	// stripe card options
	const cardStyle = {
		style: {
			base: {
				color: "#32325d",
				fontFamily: "Arial, sans-serif",
				fontSmoothing: "antialiased",
				fontSize: "16px",
				"::placeholder": {
					color: "#32325d",
				},
			},
			invalid: {
				color: "#fa755a",
				iconColor: "#fa755a",
			},
		},
	};

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant="danger">{error}</Message>
	) : (
		<>
			<h1>Order {order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name: </strong> {order.user.name}
							</p>
							<p>
								<strong>Email: </strong>
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>
							<p>
								<strong>Address: </strong>
								{order.shippingAddress.address}, {order.shippingAddress.city},{" "}
								{order.shippingAddress.postalCode},{" "}
								{order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Message variant="success">
									Delivered on {order.deliveredAt}
								</Message>
							) : (
								<Message variant="danger">Not Delivered</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}, Debit/Credit
							</p>
							{order.isPaid ? (
								<Message variant="success">Paid on {order.paidAt}</Message>
							) : (
								<Message variant="danger">Not Paid</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.orderItems.length === 0 ? (
								<Message>Order is empty</Message>
							) : (
								<ListGroup variant="flush">
									{order.orderItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={2}>
													<Image src={item.img} alt={item.name} fluid rounded />
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.quantity} x ${item.price} = $
													{item.quantity * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>

							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									{!sdkReady ? (
										<Loader />
									) : (
										<>
											<PayPalButton
												currency="INR"
												amount={parseInt(order.totalPrice)}
												onSuccess={successPaymentHandler}
											></PayPalButton>
											<CardElement
												className="m-2"
												id="card-element"
												options={cardStyle}
												onChange={handleChange}
											/>
											<Button
												type="submit"
												disabled={processing || succeeded || disabled || !order}
												className="btn-block rounded"
												onClick={handleSubmit}
											>
												<span id="button-text">
													{processing ? <StripeLoading /> : "Pay Now"}
												</span>
											</Button>
											{errorStripe && (
												<div className="m-2">
													<div className="alert alert-dismissible alert-danger my-2">
														{errorStripe}
													</div>
												</div>
											)}
											{succeeded && (
												<>
													<div className="alert alert-dismissible alert-success my-2">
														<strong>
															Payment Successful! Updating order details...
														</strong>
													</div>
												</>
											)}
										</>
									)}
								</ListGroup.Item>
							)}

							{loadingDeliver && <Loader />}
							{userInfo &&
								userInfo.isAdmin &&
								order.isPaid &&
								!order.isDelivered && (
									<ListGroup.Item>
										<Button
											type="button"
											className="btn btn-block"
											onClick={deliverHandler}
										>
											Mark as Delivered
										</Button>
									</ListGroup.Item>
								)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrdersScreen;
